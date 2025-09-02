import CategoryModel from "../models/categoryModel.js";
import ProductModel from "../models/productModel.js";
import { uploadToCloudinary,deleteFromCloudinary } from "../utils/cloudinary.js";


export const createCategory = async (req, res) => {
  try {
    const { category_name, description } = req.body;

    if (!category_name || !description || !req.file) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: category_name, description, or image file",
      });
    }

    // Upload to Cloudinary using buffer
    const cloudResult = await uploadToCloudinary(req.file.buffer, "category");

    const category = new CategoryModel({
      category_name,
      description,
      category_imageUrl: cloudResult.url,
      imagePublicId: cloudResult.public_id,
    });

    await category.save();

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category, // fixed typo from `date`
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await CategoryModel.findById(req.params.id);
    if (!category)
      return res.status(404).json({ success: false, message: "Category not found" });

    return res.status(200).json({ success: true, data: category });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    return res.status(200).json({ success: true, data: categories });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { category_name, description } = req.body;

    const category = await CategoryModel.findById(req.params.id);
    if (!category)
      return res.status(404).json({ success: false, message: "Category not found" });

    // Update fields if provided
    if (category_name) category.category_name = category_name;
    if (description) category.description = description;

    // Update image if new file uploaded
    if (req.file) {
      // Delete old image from Cloudinary
      if (category.imagePublicId) await deleteFromCloudinary(category.imagePublicId);

      const cloudResult = await uploadToCloudinary(req.file.buffer, "category");
      category.category_imageUrl = cloudResult.url;
      category.imagePublicId = cloudResult.public_id;
    }

    await category.save();

    return res.status(200).json({ success: true, message: "Category updated", data: category });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const deleteCategoryById = async (req, res) => {
  try {
    const category = await CategoryModel.findById(req.params.id);
    if (!category)
      return res.status(404).json({ success: false, message: "Category not found" });

    // Delete image from Cloudinary
    if (category.imagePublicId) await deleteFromCloudinary(category.imagePublicId);

    await category.remove();
    return res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();

    // Delete images from Cloudinary
    for (const cat of categories) {
      if (cat.imagePublicId) await deleteFromCloudinary(cat.imagePublicId);
    }

    await CategoryModel.deleteMany();
    return res.status(200).json({ success: true, message: "All categories deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      product_name,
      product_description,
      product_price,
      sale_price,
      stock_quantity,
      low_stock_threshold,
      categoryId,
      is_active
    } = req.body;

    // Check required fields
    if (
      !product_name ||
      !product_price ||
      !stock_quantity ||
      !categoryId ||
      !req.file
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Missing required fields: product_name, product_price, stock_quantity, categoryId, or image file",
      });
    }

    // Check if category exists
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Upload product image to Cloudinary
    const cloudResult = await uploadToCloudinary(req.file.buffer, "products");

    // Create new product
    const product = new ProductModel({
      product_name,
      product_description,
      product_price,
      sale_price: sale_price || null,
      stock_quantity,
      low_stock_threshold: low_stock_threshold || 5,
      is_active: is_active !== undefined ? is_active : true,
      categoryId,
      imagePublicId: cloudResult.public_id,
      product_imageUrl: cloudResult.url,
    });

    await product.save();

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find().populate("categoryId", "category_name");
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id).populate("categoryId", "category_name");

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Handle image update if new file uploaded
    if (req.file) {
      // Delete old image
      if (product.imagePublicId) {
        await deleteFromCloudinary(product.imagePublicId);
      }
      const cloudResult = await uploadToCloudinary(req.file.buffer, "products");
      updates.imagePublicId = cloudResult.public_id;
      updates.product_imageUrl = cloudResult.url;
    }

    Object.assign(product, updates);
    await product.save();

    return res.status(200).json({ success: true, message: "Product updated", data: product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Delete Cloudinary image
    if (product.imagePublicId) {
      await deleteFromCloudinary(product.imagePublicId);
    }

    await product.deleteOne();

    return res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find();

    // Delete all Cloudinary images
    for (const product of products) {
      if (product.imagePublicId) {
        await deleteFromCloudinary(product.imagePublicId);
      }
    }

    await ProductModel.deleteMany();

    return res.status(200).json({ success: true, message: "All products deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};