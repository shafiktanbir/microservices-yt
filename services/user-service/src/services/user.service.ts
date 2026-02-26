import { User, UserDocument } from "../models/user.model"
import { CreateUserDTO, UserResponse, AuthResponse } from "../types/user.types"
import { hashPassword, comparePassword, generateToken } from "../utils/utils"

// Create a new user
export const createUser = async (
  userData: CreateUserDTO,
  res: any
): Promise<AuthResponse> => {
  try {
    const existingUser = await User.findOne({ email: userData.email })
    if (existingUser) {
      throw new Error("User already exists with this email")
    }

    const hashedPassword = await hashPassword(userData.password)
    const user = new User({
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
    })

    await user.save()

    const token = generateToken(user._id.toString(), user.name, user.email)

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: true, // use HTTPS only
      sameSite: "strict",
      maxAge: 3600000, // 1 hour in milliseconds
    })

    return {
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
    }
  } catch (error) {
    throw error
  }
}

// Authenticate user login
export const loginUser = async (
  email: string,
  password: string,
  res: any
): Promise<AuthResponse> => {
  try {
    const user = await User.findOne({ email })
    if (!user) {
      throw new Error("Invalid credentials")
    }

    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
      throw new Error("Invalid credentials")
    }

    const token = generateToken(user._id.toString(), user.name, user.email)

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: true, // use HTTPS only
      sameSite: "none",
      maxAge: 3600000, // 1 hour in milliseconds
    })

    return {
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
    }
  } catch (error) {
    throw error
  }
}

// Get user by ID
export const getUserById = async (
  userId: string
): Promise<UserResponse | null> => {
  try {
    const user = await User.findById(userId)
    if (!user) {
      return null
    }
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    }
  } catch (error) {
    throw error
  }
}
