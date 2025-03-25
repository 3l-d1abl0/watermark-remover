import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs-extra';
import { config } from '../config/config.js';
import { imageService } from '../services/image.service.js';

export class ImageController {
  /**
   * Process uploaded image to remove watermark
   */
  public async processImage(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        return res.redirect('/');
      }

      // Get the uploaded file path
      const uploadPath = req.file.path;
      const fileExt = path.extname(req.file.originalname).toLowerCase();
      
      // Generate output filename and path
      const outputFilename = `generated_${path.basename(uploadPath)}`;
      const outputPath = path.join(config.generatedDir, outputFilename);

      // Process the image with Gemini
      await imageService.processImage(uploadPath, outputPath);

      // Check if output file was created
      if (!fs.existsSync(outputPath)) {
        throw new Error('Failed to generate output image. Please try again.');
      }

      // Convert images to base64 for displaying
      const originalImageData = imageService.encodeImageToBase64(uploadPath);
      const generatedImageData = imageService.encodeImageToBase64(outputPath);

      // Render the result page
      res.render('result', {
        title: 'Watermark Removed - Result',
        original_image: originalImageData,
        generated_image: generatedImageData,
        GA_ID: process.env.GA_ID || '',
        config
      });
    } catch (error) {
      console.error('Error processing image:', error);
      res.render('error', {
        title: 'ERRORRRR',
        error: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        GA_ID: process.env.GA_ID || '',
        config
      });
    }
  }

} 