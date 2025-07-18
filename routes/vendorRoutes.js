


import { vendorRegister , vendorLogin , getAllvendors, getVendorById } from '../controllers/vendorController.js'; 


import express from "express";

const router = express.Router();
router.post("/register",vendorRegister)
router.post("/login" , vendorLogin)
router.get("/all-vendors",getAllvendors)
router.get("/single-vendor/:id",getVendorById )

export default router;


