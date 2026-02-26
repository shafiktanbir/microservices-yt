import { Request, Response, NextFunction } from "express";
export type AuthRequest = Request & {
    userId?: string;
    token?: string;
};
export declare const authenticateToken: (req: AuthRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map