import jwt from 'jsonwebtoken';
import {User} from '../models/user.model.js';

const verfifyJWT = async (req, res, next) => {

    //console.log("Headers:", req.headers);

    const authHeader = req.get("Authorization");

    const token =
        req.cookies?.accessToken ||
        (authHeader && authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : null);
    
    console.log("Extracted Token:", token);
    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }
    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken.userId).select('-password -refreshTokens');
        if (!user) {
            return res.status(401).json({ message: 'Invalid token. User not found.' });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

export { verfifyJWT };