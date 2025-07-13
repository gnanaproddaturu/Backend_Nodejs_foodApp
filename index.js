
console.log("how are you")

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import vendorRoutes from "./routes/vendorRoutes.js";
import firmRoutes from "./routes/firmRoutes.js";
import uploadRoutes from "./routes/upload.js"



import productRoutes from "./routes/productRoutes.js";


dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("mongoos connect successfully")
})
.catch((error)=>{
    console.log(error)
})

const app = express()

const PORT = process.env.prot || 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/vendor",vendorRoutes );
app.use('/firm' , firmRoutes)
app.use('/product',productRoutes)
app.use("/api",uploadRoutes)

app.get("/",(req,res)=>{
     res.send("<h1> how are yu")
})



app.listen(PORT , ()=>{
    console.log(`this server run in ${PORT}`)
})