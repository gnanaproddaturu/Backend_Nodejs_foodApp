


import Firm from "../models/Firm.js";
import Vendor from "../models/Vendor.js";
import path from "path";
import fs from "fs"
import multer from "multer";
import cloudinary from "../utils/cloudinary.js";

export const uploads = multer({
    dest: "temp/",
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|webp/;
        const isValid = fileTypes.test(file.mimetype);

        if (isValid) {
            cb(null, true);
        } else {
            cb(new Error("Only images are allowed"));
        }
    }
});


export const addFirm = async (req, res) => {
    try {

        const { firmName, area, offer } = req.body;

        const category = JSON.parse(req.body.category);
        const region = JSON.parse(req.body.region);

        let imageUrl = "";

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "firms"
            });
            imageUrl = result.secure_url;
            fs.unlinkSync(req.file.path);
        }


        const vendor = await Vendor.findById(req.vendorId)
        if (!vendor) {
            return res.status(400).json({ message: "vendor not found" })
        }

        const firm = new Firm({
            firmName,
            area,
            category,
            region,
            offer,
            image: imageUrl,
            vendor: vendor._id
        })



        const savedFirm = await firm.save();
        vendor.firm.push(savedFirm._id)

        await vendor.save()
        return res.status(200).json({ message: "Firm added successfully", firm });

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error", error: error.message });

    }
}

export const getFirmById = async (req, res) => {

    try {
        const firmId = req.params.id;
        const firm = await Firm.findById(firmId).populate("product");

        if (!firm) {
            return res.status(404).json({ message: "Firm not found" });
        }

        res.status(200).json({ firm });
    } catch (error) {
        console.error("Error in getting firm:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const getAllFirms = async (req, res) => {
    try {
        const firms = await Firm.find().populate("product");

        res.status(200).json({ firms });
    } catch (error) {
        console.error("Error fetching firms:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


export const deleteFirmById = async (req, res) => {
    try {

        const firmId = req.params.firmId;
        const deletedFirm = await Firm.findByIdAndDelete(firmId)

        if (!deletedFirm) {
            return res.status(400).json({ error: "firm not found" })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" })
    }
}

