import express from "express";
import { deleteUser, getUser, getUsers, handleChangePassword, updateUser } from "../controllers/user.js";
import { verifyUser } from "../middleware/verifyToken.js";

const router = express.Router();

// UPDATE  
router.put("/:id", verifyUser, updateUser)

// CHANGE PASSWORD
router.put("/changepassword/:id", verifyUser, handleChangePassword)

// DELETE
router.delete("/:id", verifyUser, deleteUser)

// GET
router.get("/:id", verifyUser, getUser)

// GET ALL
router.get("/", getUsers)

export default router;