
import multer from "multer";
import Firm from "../models/Firm.js";
import path from "path";
import Product from "../models/Product.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";


export const uploads = multer({
    dest : 'temp/',
    limits: {
        fileSize: 5* 1024 * 1024, // 5 MB
    },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|webp/;
        const isValid = fileTypes.test(file.mimetype);

        if (isValid) {
            cb(null, true);
        } else {
           cb(new Error("Only image files (jpg, png, webp) are allowed"));
        }
    }

}).single('image');

export const addProduct = async (req, res) => {
  try {


    const { price, category, bestSeller, description } = req.body;

    const productName = Array.isArray(req.body.productName)
      ? req.body.productName[0]
      : req.body.productName;

    const firmId = req.params.firmId;

     const firm = await Firm.findById(firmId);

      if (!firm) {
      return res.status(404).json({ message: "Firm not found" });
    }

    const existingProduct =await Product.findOne({productName, firm : firmId});
    if(existingProduct){
      console.log("Product already exists")
      return res.status(400).json({
        message: " Product with this name already exists in this firm"
      })
    }

    let imageUrl = ""
    if(req.file){
      const result = await cloudinary.uploader.upload(req.file.path,{
        folder : "products"
      })
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path)
    }

    console.log("👉 description received:", description);


    const product = new Product({
      productName,
      price: Number(price),  // safely convert to number
      category,
      bestSeller,
      description,
      image:imageUrl,
      firm: firmId
    });

    const savedProduct = await product.save();

     firm.product.push(savedProduct._id);
    await firm.save();

    res.status(200).json(savedProduct);
  } catch (error) {
    console.error(" Error in addProduct:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


export const getProductId = async (req, res) => {
    
    try {
        const firmId = req.params.firmId;

    const firm = await Firm.findById(firmId).populate("product");

    if (!firm) {
      return res.status(404).json({ message: "Firm not found" });
    }

    const restaurantName = firm.firmName
    const products = await Product.find({firm : firmId})

    res.status(200).json({ restaurantName , products });
  } catch (error) {
    console.error("Error in getting firm:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const deleteProductById = async(req , res)=>{
  try {
    
    const productId = req.params.productId
    const deletedProduct = await Product.findByIdAndDelete(productId)
    if(!deletedProduct){
      return res.status(400).json({error  : "not product found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({message  : "Internal server error"})
  }
}



