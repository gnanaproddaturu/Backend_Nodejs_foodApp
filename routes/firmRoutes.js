

import express from "express";
import { addFirm ,uploads } from "../controllers/firmController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { getFirmById } from "../controllers/firmController.js";
import { getAllFirms } from "../controllers/firmController.js";
import { deleteFirmById } from "../controllers/firmController.js";



const router = express.Router();

router.post("/add-firm" , verifyToken,uploads.single("image"),addFirm)
router.get("/all-firms", getAllFirms);
router.get("/single-firm/:id", getFirmById);
router.delete('/:firmId' , deleteFirmById)


export default router;

