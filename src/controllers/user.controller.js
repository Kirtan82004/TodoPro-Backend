import {User} from '../models/user.model.js';

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).select('-password -refreshTokens');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error("Error in getUserProfile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getCurrentUser = async (req, res) => {
    return res
        .status(200)
        .json(req.user, "current user fetched successfuly")
};

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const updates = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true }
        ).select('-password -refreshTokens');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error("Error in updateUserProfile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const changePassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }
        user.password = newPassword;
        await user.save({ validateBeforeSave: false });
        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Error in changePassword:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const deleteUserAccount = async (req, res) => {
    try {
        const userId = req.user._id;
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: "User account deleted successfully" });
    } catch (error) {
        console.error("Error in deleteUserAccount:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const updateAvatar = async (req, res) =>{
    try {
        
    } catch (error) {
        
    }
}

export { getUserProfile, updateUserProfile, changePassword, deleteUserAccount, getCurrentUser, updateAvatar };