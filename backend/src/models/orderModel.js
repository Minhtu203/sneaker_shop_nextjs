import mongoose, { Schema } from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentCode: { type: String, required: true, unique: true },
    totalAmount: { type: Number, required: true },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Shoes",
          required: true,
        },
        name: { type: String, required: true },
        color: {
          colorName: { type: String },
          color: { type: String }, // Lưu mã hex như #0b090a
          img: [{ type: String }], // Mảng chứa danh sách link ảnh sản phẩm
        },
        size: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, require: true },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "CreditCard", "BANK_TRANSFER", "Paypal"],
      default: "COD",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Shipping", "Delivered", "Cancelled"],
      default: "Pending",
    },
    note: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
