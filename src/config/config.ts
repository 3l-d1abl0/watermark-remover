import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface Config {
  port: number;
  environment: string;
  uploadDir: string;
  generatedDir: string;
  fileTTL: number;
  googleClientId: string;
  googleClientSecret: string;
  googleCallbackUrl: string;
  geminiApiKey: string;
  sessionSecret: string;
  gaId: string;
}

// Export configuration
export const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  environment: process.env.NODE_ENV || 'development',
  uploadDir: process.env.UPLOAD_DIR || path.join(process.cwd(), 'tmp', 'uploads'),
  generatedDir: process.env.GENERATED_DIR || path.join(process.cwd(), 'tmp', 'generated'),
  fileTTL: parseInt(process.env.FILE_TTL || '600', 10), // 10 minutes in seconds
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL || '/callback',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  sessionSecret: process.env.SESSION_SECRET || 'watermark-remover-secret',
  gaId: process.env.GA_ID || '',
};

// Validate required configuration
export const validateConfig = (): boolean => {
  const requiredEnvVars = [
    'GEMINI_API_KEY',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'SESSION_SECRET'
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.error(`Error: Environment variable ${envVar} is required but not set.`);
      return false;
    }
  }

  return true;
}; 