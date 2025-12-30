import { verfifyJWT } from "../middlewares/auth.middleware.js";
import {
    getUserProfile, 
    updateUserProfile, 
    changePassword, 
    getCurrentUser,
    updateAvatar
} from "../controllers/user.controller.js";
import express from "express";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.route("/profile").get(verfifyJWT, getUserProfile);
router.route("/update-profile").patch(verfifyJWT, updateUserProfile);
router.route("/change-password").patch(verfifyJWT, changePassword);
router.route("/me").get(verfifyJWT, getCurrentUser);
router.route("/upload-avatar").patch(verfifyJWT,upload.single('avatar'),updateAvatar);

export default router;