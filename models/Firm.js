

import mongoose, { Schema } from "mongoose";


const firmSchema = new mongoose.Schema({
  firmName: {
    type: String,
    required: true,
    unique: true
  },
  area: {
    type: String,
    required: true
  },
  category: {
    type: [
      {
        type: String,
        enum: ["veg", "non-veg"]
      }
    ]
  },
  region: {
    type :[
      {
        type : String,
        enum :["south-indian", "north-indian", "chinese", "bakery"]
      }
    ]
  },
  offer: { type: String },
  image: { type: String, required: true },
  vendor: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor"
  }],
  product: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
});


firmSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  }
});


const Firm = mongoose.model("Firm", firmSchema)
export default Firm;

