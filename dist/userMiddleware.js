"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || '123abc';
//@ts-ignore
const userMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            "error": "no  token"
        });
    }
    try {
        const user = jwt.verify(token, secretKey);
        req.user = user;
        next();
    }
    catch (e) {
        return res.status(411).json({
            "error": "Invalid JWT Token"
        });
    }
};
exports.default = userMiddleware;
