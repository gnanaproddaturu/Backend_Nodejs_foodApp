


import jwt from "jsonwebtoken";
import Vendor from "../models/Vendor.js";
import dotenv from "dotenv"

dotenv.config();

const secretKey = process.env.WhatIsYourName


export const verifyToken = async (req, res, next) => {

    const token = req.headers.token;
    const fallbackToken = req.headers.token;

    if (!token) {
        return res.status(404).json({ error: " token is reqired" })
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        const vendor = await Vendor.findById(decoded.vendorId);
        if (!vendor) {
            return res.status(400).json({ error: "vendor not found" })
        }

        req.vendorId = vendor._id
        next()

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Invalid or expired token" })
    }

}
