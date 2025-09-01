import express from 'express'
import { createCategory, createProduct, deleteAllCategories, deleteCategoryById, getAllCategories, getCategoryById, updateCategory } from '../controller/productController.js';
import { upload } from '../middileware/multer.js';

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

export default productRouter;