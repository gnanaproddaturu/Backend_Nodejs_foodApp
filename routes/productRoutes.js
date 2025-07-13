
import express from "express"
import { addProduct } from "../controllers/productController.js";
import { uploads } from "../controllers/firmController.js";
import { getProductId } from "../controllers/productController.js";
import { deleteProductById } from "../controllers/productController.js";


const router = express.Router();

router.post('/add-product/:firmId',uploads.single("image"),addProduct)
router.get('/:firmId/products' ,getProductId )
router.delete('/:productId' , deleteProductById)


export default router;