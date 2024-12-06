"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_TOKEN;
const generateToken = (user) => {
    return jwt.sign({
        id: user._id
    }, JWT_SECRET);
};
exports.generateToken = generateToken;
