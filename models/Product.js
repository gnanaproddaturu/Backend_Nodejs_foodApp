

import mongoose, { Schema } from "mongoose";

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true
  },
  price:
   { 
    type: Number,
     required: true
     },
  category: {
    type: [String],
    enum: ["veg", "non-veg"]
  },
  image: {
     type: String
     },
  bestSeller: {
     type: String 
    },
  description: {
     type: String 
    },
  firm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Firm'
  }
});



productSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  }
});

const Product = mongoose.model("Product", productSchema)
export default Product;