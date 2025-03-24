import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from './config.js';
import { User } from '../interfaces/user.interface';

export const setupPassport = (): void => {
  // Serialize user
  passport.serializeUser((user: any, done) => {
    done(null, user);
  });

  // Deserialize user
  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });

  // Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.googleClientId,
        clientSecret: config.googleClientSecret,
        callbackURL: config.googleCallbackUrl,
        scope: ['profile', 'email'],
      },
      (accessToken: string, refreshToken: string, profile: any, done: any) => {
        // Create user object from profile
        const user: User = {
          id: profile.id,
          displayName: profile.displayName || 'Unknown User',
          email: profile.emails?.[0]?.value || '',
          photo: profile.photos?.[0]?.value || '',
        };

        return done(null, user);
      }
    )
  );
}; 