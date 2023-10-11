import express from "express";
import { register, login, refreshToken, logout } from "../controllers/auth.js";


const router = express.Router();

router.post('/login', login)
router.post('/register', register)
router.get('/logout', logout)

// refresh token
router.get('/refresh', refreshToken)

export default router;