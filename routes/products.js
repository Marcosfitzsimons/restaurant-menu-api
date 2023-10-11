import express from "express";
import { createProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from "../controllers/product.js";
import { verifyAdmin } from "../middleware/verifyToken.js";


const router = express.Router();

router.post("/", verifyAdmin, createProduct)

router.get("/", getAllProducts)
router.get("/:id", getProduct)

router.put("/:id", verifyAdmin, updateProduct)

router.delete("/:id", verifyAdmin, deleteProduct)


export default router;