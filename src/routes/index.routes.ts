import express from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { IndexController } from '../controllers/index.controller';

const router = express.Router();
const indexController = new IndexController();

// Home page
router.get('/', isAuthenticated, indexController.getHomePage);

export const indexRoutes = router; 