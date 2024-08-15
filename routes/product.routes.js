import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductsByCategory,
  getProductById,
  updateProduct,
  deleteProduct,createProductcheckout
} from '../controllers/product.controller.js';
import upload from '../config/multerConfig.js';

const router = express.Router();

router.post('/products', upload.array('images', 10), createProduct); // Handle image uploads

router.post('/products/chackout', createProductcheckout);
router.get('/products', getAllProducts);
router.get('/products/category/:category', getProductsByCategory);
router.get('/products/:id', getProductById);
router.patch('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

export default router;
