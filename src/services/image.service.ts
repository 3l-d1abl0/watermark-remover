import fs from 'fs-extra';
import { GoogleGenerativeAI, Part, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { config } from '../config/config.js';

class ImageService {
    private genAI: GoogleGenerativeAI;
  
    constructor() {
      // Initialize the Google Generative AI client
      this.genAI = new GoogleGenerativeAI(config.geminiApiKey);
    }
  
    /**
     * Convert image to base64 for embedding in HTML
     */
    public encodeImageToBase64(filePath: string, mimeType: string = 'image/png'): string {
      try {
        const imageBuffer = fs.readFileSync(filePath);
        const base64Image = imageBuffer.toString('base64');
        return `data:${mimeType};base64,${base64Image}`;
      } catch (error) {
        console.error('Error encoding image to base64:', error);
        throw error;
      }
    }
  
    /**
     * Process the image using Google Gemini
     */
    public async processImage(inputPath: string, outputPath: string): Promise<string> {
        try {
            // Check if input file exists
            if (!fs.existsSync(inputPath)) {
              throw new Error(`Input file not found: ${inputPath}`);
            }
        
            // Check if output directory is writable
            const outputDir = outputPath.substring(0, outputPath.lastIndexOf('/'));
            if (!fs.existsSync(outputDir)) {
              fs.mkdirSync(outputDir, { recursive: true });
            }
        
            console.log(`Processing file: ${inputPath}`);
        
            // Read image data
            const imageData = fs.readFileSync(inputPath);
        
            // Get the Gemini model with safety settings
            const safetySettings = [
              {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_NONE,
              },
              {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_NONE,
              },
              {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_NONE,
              },
              {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_NONE,
              },
            ];
            
            // Create generation config
            const generationConfig = {
              temperature: 0.9,
              topP: 0.95,
              topK: 40,
              maxOutputTokens: 2048,
              responseModalities: ['Text', 'Image'],
            };

            /*
                "gemini-1.0-pro-vision
                gemini-2.0-pro-vision
                gemini-2.0-flash-lite-001
                gemini-2.0-flash-exp-image-generation
                */
               const model = this.genAI.getGenerativeModel({
                 model: 'gemini-2.0-flash-exp-image-generation',
                 safetySettings,
                 generationConfig,
                });
                

            // Prepare the prompt for watermark removal
            const prompt = `
                  You are a Professional top-notch Photographer and photo editor.
                  You need to help a novice who have added watermark to one of its image.
                  You need to remove all the watermarks without affectiong rest of the Image.
                  First of all, examine the image and identify the watermarks and other subjects of the image.
                  Once you have identified the watermarks, remove them from the image without disturbing rest of the image.
                  If any watermark is overlapping with other subjects, please ensure that you only remove the watermark and not the other subjects.
                  Please ensure that the final image does not contain any visible traces of the watermark and does not touch the other subjects in the image.
              `;
        
            // Convert image to a part object
            const imagePart: Part = {
              inlineData: {
                data: imageData.toString('base64'),
                mimeType: 'image/jpeg',
              },
            };
        
        
            // Generate the content
            const result = await model.generateContent({
              contents: [{ role: 'user', parts: [imagePart, { text: prompt }] }]
            });
            const response = await result.response;
            

            //console.log("Gemini Response:", JSON.stringify(result)); // Log the full response

            // Process and save the response
            const parts = response.candidates?.[0]?.content?.parts || [];
            for (const part of parts) {
              console.log(part.text);
              if (part.inlineData) {
                const imageBuffer = Buffer.from(part.inlineData.data, 'base64');
                fs.writeFileSync(outputPath, imageBuffer);
                console.log(`Processed image saved to: ${outputPath}`);
                return outputPath;
              }
            }
        
            throw new Error('No image data received in response');
          } catch (error) {
            console.error('Error processing image with Gemini:', error);
            throw error;
          }
    }
  }
  
  export const imageService = new ImageService(); 