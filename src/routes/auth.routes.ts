import express from 'express';
import passport from 'passport';
import { isAuthenticated, isNotAuthenticated } from '../middlewares/auth.middleware.js';
import { AuthController } from '../controllers/auth.controller.js';

const router = express.Router();
const authController = new AuthController();

// Login page
router.get('/login', isNotAuthenticated, authController.getLoginPage);

// Google OAuth login
router.get('/login/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Google OAuth callback
router.get('/callback', passport.authenticate('google', {
  failureRedirect: '/login'
}), authController.googleCallback);

// Direct Google login (alternative route)
router.get('/direct-google-login', authController.directGoogleLogin);

// Logout
router.get('/logout', isAuthenticated, authController.logout);

export const authRoutes = router; 