import OrderModel from "../models/orderModel.js";
import { sendOrderToWhatsApp } from "../utils/whatsapp.js";
import { orderValidate } from "../validators/orderValidation.js";

// Create Cart
export const createOrder = async (req, res) => {
  try {
    const { error } = orderValidate.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { customer, items } = req.body;

    if (!customer || !items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Customer details and at least one item are required" });
    }

    // Create new order
    const order = new OrderModel({
      customer,
      items,
    });

    await order.save();

    // Send WhatsApp notification to seller
    await sendOrderToWhatsApp(order);

    res.status(201).json({
      message: "Order created successfully & sent to WhatsApp",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Carts
export const getAllOrder = async (req, res) => {
  try {
    const orders = await OrderModel.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Cart By ID
export const getOrderById = async (req, res) => {
  try {
    const orders = await OrderModel.findById(req.params.id);
    if (!cart) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Cart By ID
export const deleteOrderById = async (req, res) => {
  try {
    const order = await OrderModel.findByIdAndDelete(req.params.id);
    if (!cart) {
      return res.status(404).json({ message: "order not found" });
    }
    res.status(200).json({ message: "order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete All Carts
export const deleteAllOrder = async (req, res) => {
  try {
    await OrderModel.deleteMany();
    res.status(200).json({ message: "All orders deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};