const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxLength: 32,
    },
    subtitle: {
      type: String,
      trim: true,
      maxLength: 2000,
    },
    descripiton: {
      type: String,
      trim: true,
      maxLength: 5000,
    },
    price: {
      type: Number,
      required: true,
      maxlength: 32,
      trim: true,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;