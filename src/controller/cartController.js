import cartModel from "../models/cartModel.js";


// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req?.user?.id;
    console.log(req?.user)
    if(!userId){
        return res.status(401).json({success:false,message:"login or invalid user"})
    }
    const { productId, variantId, quantity } = req.body;

    let cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      cart = new cartModel({ user: userId, items: [] });
    }

    // Check if product already in cart
    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        (!variantId || item.variant?.toString() === variantId)
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({
        product: productId,
        variant: variantId || null,
        quantity: quantity || 1,
      });
    }

    await cart.save();
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user cart
export const getCart = async (req, res) => {
  try {
    const userId = req?.user?.id;
    const cart = await cartModel
      .findOne({ user: userId })
      .populate("items.product", "product_name product_price product_imageUrl sale_price") // only needed fields
      .populate("items.variant", "productvarient_name");

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update item quantity
export const updateCartItem = async (req, res) => {
  try {
    const userId = req?.user?.id;
    const { itemId, quantity } = req.body;

    const cart = await cartModel.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    item.quantity = quantity;
    await cart.save();

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove item
export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId } = req.params;

    const cart = await cartModel.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items.id(itemId).remove();
    await cart.save();

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
