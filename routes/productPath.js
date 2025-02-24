import express from 'express';
import { 
  createProduct, 
  getAllProducts, 
  getProductById, 
  updateProductById, 
  deleteProductById 
} from '../controllers/productController.js';
import upload from '../utils/multer.js';

const productRouter = express.Router();

productRouter.post('/', upload.single('upload/Bonae Ineza.png'), createProduct);

productRouter.get('/', getAllProducts);

productRouter.get('/:id', getProductById);

productRouter.put('/:id', upload.single('productImage'), updateProductById);

productRouter.delete('/:id', deleteProductById);

export default productRouter;