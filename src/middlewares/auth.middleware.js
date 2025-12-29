import jwt from 'jsonwebtoken';
import {User} from '../models/user.model.js';

const verfifyJWT = async (req, res, next) => {
    const token = req.cookies?.accessToken || req.headr('authorization')?.replace('Bearer ', '');
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