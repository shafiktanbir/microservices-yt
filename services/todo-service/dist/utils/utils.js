"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractUserIdFromToken = void 0;
const extractUserIdFromToken = (token) => {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(atob(base64)
            .split("")
            .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join(""));
        const payload = JSON.parse(jsonPayload);
        return payload.userId || null;
    }
    catch (error) {
        return null;
    }
};
exports.extractUserIdFromToken = extractUserIdFromToken;
//# sourceMappingURL=utils.js.map