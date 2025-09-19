import cartModel from "../models/cartModel.js";
import ChargesModel from "../models/chargesModel.js";
import OrderModel from "../models/orderModel.js"; // adjust path

export const createOrder = async (req, res) => {
  try {
    const { items, cartId, shippingAddress, notes } = req.body;
    const userId = req.user?.id;
    let finalItems = [];

    // ✅ Direct buy or cart checkout
    if (items && items.length > 0) {
      finalItems = items;
    } else if (cartId) {
      const cart = await cartModel
        .findById(cartId)
        .populate("items.product");
      console.log(cart,"testing")  
      if (!cart || !cart.items.length) {
        return res
          .status(400)
          .json({ success: false, message: "Cart is empty" });
      }
      finalItems = cart.items.map((item) => ({
        product: item.product?._id,
        variant: item.variant?._id,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.totalPrice
      }));
      cart.items = [];
      await cart.save();
    } else {
      return res
        .status(400)
        .json({ success: false, message: "No items provided" });
    }

    // ✅ Auto calculate subtotal
    const subtotal = finalItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // ✅ Fetch charges from DB
    const charges = await ChargesModel.findOne();
    const tax = charges?.tax || 0;
    const shippingFee = charges?.shippingFee || 0;
    const discount = charges?.discount || 0;

    const taxAmount = (subtotal * tax) / 100;
    const discountAmount = (subtotal * discount) / 100;

    const totalAmount = subtotal + taxAmount + shippingFee - discountAmount;

    const newOrder = new OrderModel({
      user: userId,
      items: finalItems,
      subtotal,
      tax:taxAmount,
      shippingFee,
      discount:discountAmount,
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


export const getAllorders = async(req, res) =>{
  try {
    const order = await OrderModel.find();
    if(!order){
      return res.status(404).json({success:false , message:"NotFound"})
    }
    res.status(200).json({success:true, data:order})
    
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch order" });
  }
}