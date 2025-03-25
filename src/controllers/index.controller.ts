import { Request, Response } from 'express';
import { config } from '../config/config.js';

export class IndexController {
  /**
   * Render the home page
   */
  public getHomePage(req: Request, res: Response): void {
      
    // If user is not authenticated, redirect to login
      if (!req.isAuthenticated()) {
        return res.redirect('/login');
      }


    res.render('index', {
      title: 'Remove Watermark From Image',
      GA_ID: process.env.GA_ID || '',
      config
    });
  }
} 