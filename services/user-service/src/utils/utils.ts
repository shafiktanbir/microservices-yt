import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const SALT_ROUNDS = 10

// Hash a password using bcrypt
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

// Compare a plain text password with a hashed password
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword)
}

// Generate a JWT token
export const generateToken = (userId: string, name: string, email: string) => {
  const secret = process.env.JWT_SECRET || "default_secret"
  return jwt.sign({ userId, name, email }, secret, { expiresIn: "7d" })
}

// Verify a JWT token
export const verifyToken = (token: string): { userId: string } => {
  const secret = process.env.JWT_SECRET || "default_secret"
  return jwt.verify(token, secret) as { userId: string }
}
