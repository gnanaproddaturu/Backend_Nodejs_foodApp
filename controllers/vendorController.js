
import Vendor from "../models/Vendor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const secretKey = process.env.WhatIsYourName

export const vendorRegister = async (req, res) => {

    const { username, email, password } = req.body;

    try {
        const vendorEmail = await Vendor.findOne({ email });
        if (vendorEmail) {
            return res.status(400).json({ message: "Email already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newVendor = new Vendor({ username, email, password: hashedPassword })

        await newVendor.save();
        res.status(201).json({ message: " vendor register successfull" })
        console.log("registered")
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "server error" })
    }

}

export const vendorLogin = async (req, res) => {

    const { email, password } = req.body;

    try {

        const vendor = await Vendor.findOne({ email });
        if (!vendor) {
            return res.status(401).json({ message: "vendor not found" })

        }

        const validPass = await bcrypt.compare(password, vendor.password);
        if (!validPass) {
            return res.status(404).json({ message: "Wrong password" })
        };

        const token = jwt.sign({ vendorId: vendor._id }, secretKey, { expiresIn: "1h" })

        res.status(200).json({ message: "Login successful", token });
        console.log(email)

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Erron in login" })
    }
}

export const getAllvendors = async (req, res) => {
    try {
        const vendor = await Vendor.find().select("-password -__v").populate({
            path: "firm",
            populate: {
                path: "product"
            }
        });

        if (!vendor) {
            return res.status(500).json({ message: "Vendor not found" })
        }

        res.status(200).json({ vendor })

    } catch (error) {
        console.error("Error in getting firms:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const getVendorById = async (req, res) => {
    const vendorId = req.params.id

    try {

        const vendor = await Vendor.findById(vendorId)
            .select("-password -__v")
            .populate({
                path: 'firm',
                populate: {
                    path: 'product'
                }
            });

        if (!vendor) {
            return res.status(404).json({ message: "vensor not found" })
        }

        res.status(200).json({ vendor })
    } catch (error) {
        console.error("Error in getting firms:", error);
        res.status(500).json({ message: "internal server error" });
    }
}