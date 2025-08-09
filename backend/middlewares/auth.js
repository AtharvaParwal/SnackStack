const jwt = require('jsonwebtoken');
const { Buyer, Vendor } = require('../models/Users');

const JWT_SECRET = process.env.JWT_SECRET;

// Generate JWT Token
const generateToken = (user, userType) => {
    const payload = {
        id: user._id,
        email: user.email,
        userType: userType
    };
    
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

// Verify JWT Token Middleware
const verifyToken = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Find user based on type
        let user;
        if (decoded.userType === 'Buyer' || decoded.userType === 'buyer') {
            user = await Buyer.findById(decoded.id);
        } else if (decoded.userType === 'Vendor' || decoded.userType === 'vendor') {
            user = await Vendor.findById(decoded.id);
        }

        if (!user) {
            return res.status(401).json({ error: 'Invalid token. User not found.' });
        }

        // Add user info to request
        req.user = {
            id: user._id,
            email: user.email,
            userType: decoded.userType,
            userData: user
        };

        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ error: 'Invalid token.' });
    }
};

// Verify user type middleware
const verifyUserType = (allowedTypes) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required.' });
        }

        const userType = req.user.userType.toLowerCase();
        const allowed = allowedTypes.map(type => type.toLowerCase());

        if (!allowed.includes(userType)) {
            return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
        }

        next();
    };
};

module.exports = {
    generateToken,
    verifyToken,
    verifyUserType,
    JWT_SECRET
};
