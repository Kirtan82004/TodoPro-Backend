import { verfifyJWT } from "../middlewares/auth.middleware.js";
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    refreshAccessToken 
} from "../controllers/auth.controller.js";
import express from "express";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verfifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

export default router;