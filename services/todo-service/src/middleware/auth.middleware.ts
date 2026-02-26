import { Request, Response, NextFunction } from "express"
import { extractUserIdFromToken } from "../utils/utils"
import jwt from "jsonwebtoken"

export type AuthRequest = Request & {
  userId?: string
  token?: string
}

// Middleware to extract user ID from JWT token stored in cookies
export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies?.authToken
    console.log("Extracted token from cookies:", token)

    if (!token) {
      res.status(401).json({ error: "Access token required" })
      return
    }

    const user = jwt.decode(token)

    // @ts-ignore
    req.userId = user.userId
    req.token = token
    next()
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token" })
  }
}
