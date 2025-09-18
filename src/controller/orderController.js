import Order from "../models/orderModel.js"; // adjust path

// ✅ Create new order
export const createOrder = async (req, res) => {
  try {
    const {
      items,
      subtotal,
      tax,
      shippingFee,
      discount,
      totalAmount,
      shippingAddress,
      notes,
    } = req.body;

    // Attach logged-in user ID (assuming you have req.user set by auth middleware)
    const userId = req.user?.id || req.body.user;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items in order" });
    }

    const newOrder = new Order({
      user: userId,
      items,
      subtotal,
      tax,
      shippingFee,
      discount,
      totalAmount,
      shippingAddress,
      notes,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ success: true, order: savedOrder });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
};

// ✅ Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "username email")
      .populate("items.product")
      .populate("items.variant");

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Get All Orders Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

// ✅ Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "username email")
      .populate("items.product")
      .populate("items.variant");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error("Get Order Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch order" });
  }
};

// ✅ Update order by ID
export const updateOrderById = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("user", "username email")
      .populate("items.product")
      .populate("items.variant");

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Update Order Error:", error);
    res.status(500).json({ success: false, message: "Failed to update order" });
  }
};

// ✅ Delete order by ID
export const deleteOrderById = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order deleted" });
  } catch (error) {
    console.error("Delete Order Error:", error);
    res.status(500).json({ success: false, message: "Failed to delete order" });
  }
};
