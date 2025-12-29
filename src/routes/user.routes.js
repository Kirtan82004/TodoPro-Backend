import { verfifyJWT } from "../middlewares/auth.middleware.js";
import {
    getUserProfile, 
    updateUserProfile, 
    changePassword, 
    getCurrentUser
} from "../controllers/user.controller.js";
import express from "express";

const router = express.Router();

router.route("/profile").get(verfifyJWT, getUserProfile);
router.route("/update-profile").patch(verfifyJWT, updateUserProfile);
router.route("/change-password").patch(verfifyJWT, changePassword);
router.route("/me").get(verfifyJWT, getCurrentUser);

export default router;