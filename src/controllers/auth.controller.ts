import { Request, Response } from 'express';
import { config } from '../config/config.js';

export class AuthController {
  /**
   * Render the login page
   */
  public getLoginPage(req: Request, res: Response): void {
    res.render('login', {
      title: 'Login - Remove Watermark From Image',
      GA_ID: process.env.GA_ID || '',
      config
    });
  }

  /**
   * Handle Google OAuth callback
   */
  public googleCallback(req: Request, res: Response): void {
    res.redirect('/');
  }

  /**
   * Direct Google login (alternative method)
   */
  public directGoogleLogin(req: Request, res: Response): void {
    const clientId = config.googleClientId;
    const redirectUri = `${req.protocol}://${req.get('host')}/callback`;
    const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
      include_granted_scopes: 'true'
    });
    
    const fullUrl = `${authUrl}?${params.toString()}`;
    console.log(`Manual OAuth URL: ${fullUrl}`);
    
    res.redirect(fullUrl);
  }

  /**
   * Logout user
   */
  public logout(req: Request, res: Response): void {
    req.logout((err) => {
      if (err) {
        console.error('Error during logout:', err);
      }
      // Clear the session
      req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
        }
        // Redirect to login page after clearing session
        res.redirect('/login');
      });
    });
  }
} 