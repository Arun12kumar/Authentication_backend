import ProductModel from "../models/productModel.js";

export const searchAllProduct = async (req, res) => {
  try {
    const product = await ProductModel.find(req.query);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};