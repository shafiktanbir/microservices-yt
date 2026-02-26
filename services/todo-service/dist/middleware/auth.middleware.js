"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Middleware to extract user ID from JWT token stored in cookies
const authenticateToken = (req, res, next) => {
    try {
        const token = req.cookies?.authToken;
        console.log("Extracted token from cookies:", token);
        if (!token) {
            res.status(401).json({ error: "Access token required" });
            return;
        }
        const user = jsonwebtoken_1.default.decode(token);
        // @ts-ignore
        req.userId = user.userId;
        req.token = token;
        next();
    }
    catch (error) {
        res.status(403).json({ error: "Invalid or expired token" });
    }
};
exports.authenticateToken = authenticateToken;
//# sourceMappingURL=auth.middleware.js.map