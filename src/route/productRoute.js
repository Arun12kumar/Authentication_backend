import express from 'express'
import { createCategory, createProduct, createProductVarient, deleteAllCategories, deleteAllProducts, deleteCategoryById, deleteProductById, getAllCategories, getAllProducts, getCategoryById, getProductById, updateCategory, updateProduct } from '../controller/productController.js';
import { upload,uploadMultiple } from '../middileware/multer.js';

const productRouter = express.Router();

// category routes
productRouter.post('/category', upload.single("file"), createCategory)
productRouter.get("/category", getAllCategories);
productRouter.get("/category/:id", getCategoryById);
productRouter.put("/category/:id", upload.single("file"), updateCategory);
productRouter.delete("/category/:id", deleteCategoryById);
productRouter.delete("/category", deleteAllCategories);

// product routes
productRouter.post('/', upload.single("file"), createProduct)
productRouter.get('/', getAllProducts)
productRouter.get('/:id', getProductById)
productRouter.put('/', upload.single("file"), updateProduct)
productRouter.delete('/', deleteAllProducts)
productRouter.delete('/:id', deleteProductById)

// product varients
productRouter.post('/product_varient', uploadMultiple, createProductVarient)

export default productRouter;