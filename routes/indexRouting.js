import express from 'express';
// import contactRouter from './contactPath.js';
import productRouter from './productPath.js';

const mainRouter = express.Router();

// Contact routes
// mainRouter.use('/contact', contactRouter);

mainRouter.use('/products', productRouter);

export default mainRouter;