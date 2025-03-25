import fs from 'fs-extra';
import { GoogleGenerativeAI, Part, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { config } from '../config/config.js';
import {decrypt} from './hush.service.js';

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
            const promptDetails = {
              iv: 'b8512b88cee8e82269b5c373',
              encryptedData: 'bab58d2194b6cb7aea71ece6037feae80a0fc6b33031d8b5eb7142839e54fe5d97f9cce545c9d163d12961776933e38951dd52dd8b5bced6a42fb6ab03093c0396b09a438841f15acd9100060951202f7a48cfc1806c4d8639a4a2e0ad885f8e06f1c54a41ef45c61693c61c60f12564721dc8a88d736a34f180711997dca93743a7954e8ad493ec1ad60192cf619f357c2e9b804583e9ab8f794f0aeccc90bd460fa4f67c86ddabbe60cc9517c53b7bd412b7da25419526378593c33b42cb43437a5ee8f7e727dd33aa530c0538603ea74eaba8d4162c563a14de37807ac899249d5d2dad95724e10ebf3b06898578da123735bb76127d8783fd48944f845d9babe97ab0c917c853a36949db691d6a40d0dd086017c4793e1312002164f644e8ce07075bb78909b69b9f77ff3d446f371b105875ba5735fc567f8541af12029b1f9516f5f08cab05e0f0352a82705f1dbb476cc7b62cccb9466261c59afb904c548905fb247c1922f89a8ddfa2f43d69e3081067bc4bf0bfefee62c2df1b4d185c9bf18e4c7da0ad67229cc69640935f32262d111a2b01d3b9e681337fc703cbcc055f819492a363d821813717a3dcac22e6835acb0214345eed6244247e4eff3fcf0650887aa010f496a09a23c32e188e7059329c9703369e0c22052cf338e5b10437c7a83f558025dfd1d57389cd9d890248f6ac76a943115a20f6a880fc4866c349d4e72adcc79bfc86cd2d732c653d59bed5d3fccfdae554be92c1f4f5f7b6d31cf3b29dec4b978bc245cb51dda38ef19f769f67ff86b3450b1dd844517e1375889ef5e4b5529e3348e7e71dd38f8e1f46f1b82cdfe96c9a26da0f88eb147fcf983566df4985607613a32e63d66c330ac87e099ee0fcb4ce545988168f6e160252ebafa92303e8a1dc2b35cf1f24d39d23c922b88706299927c92f1a516a9e19f8a737ccf6bd6c0951ada803cfc287034',
              authTag: '04ecfa6aa3c6e2b24223c4a50ab90125'
            };

            const prompt = decrypt(promptDetails.encryptedData, config.sessionSecret, promptDetails.iv, promptDetails.authTag);
            
            console.log(prompt);
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