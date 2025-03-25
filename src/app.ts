import express from 'express';
import path from 'path';
import fs from 'fs-extra';
import logger from 'morgan';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import expressLayouts from 'express-ejs-layouts';
import { config } from './config/config.js';
import { setupPassport } from './config/passport';
import { authRoutes } from './routes/auth.routes.js';
import { indexRoutes } from './routes/index.routes.js';
import { imageRoutes } from './routes/images.routes.js';


// Initialize Express app
const app = express();

// Configure view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');
app.use(expressLayouts);

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Ensure upload and generated directories exist
fs.ensureDirSync(config.uploadDir);
fs.ensureDirSync(config.generatedDir);

// Configure session and passport
app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Set up passport strategies
setupPassport();

// Make user and config available in templates
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.config = config;
  res.locals.GA_ID = process.env.GA_ID || '';
  next();
});


// Routes
app.use('/', authRoutes);   //auth pages
app.use('/', indexRoutes);  //index Page
app.use('/', imageRoutes);  //handle images calls


// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500);
  res.render('error', {
    error: err.message || 'Something went wrong!',
    status: err.status || 500,
    title: 'Error'
  });
});


export default app; 