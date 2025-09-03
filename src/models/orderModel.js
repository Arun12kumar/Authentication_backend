import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: { type: String, required: true },
    variantName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock_quantity: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customer: {
      name: { type: String, required: true },
      email: { type: String },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    items: [orderItemSchema],
    totalQuantity: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
orderSchema.pre("save", function (next) {
  this.totalQuantity = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.totalAmount = this.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  next();
});
const OrderModel = mongoose.model("Order", orderSchema);
export default OrderModel;
