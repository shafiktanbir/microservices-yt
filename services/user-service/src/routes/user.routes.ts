import { Router, Request, Response } from "express"
import { createUser, loginUser } from "../services/user.service"

const router = Router()

// Register a new user
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body

    if (!email || !password || !name) {
      res.status(400).json({ error: "Email, password, and name are required" })
      return
    }

    const result = await createUser({ email, password, name }, res)
    res.status(201).json(result)
  } catch (error) {
    const err = error as Error
    res.status(400).json({ error: err.message })
  }
})

// Login user
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" })
      return
    }

    const result = await loginUser(email, password, res)
    res.status(200).json(result)
  } catch (error) {
    const err = error as Error
    res.status(401).json({ error: err.message })
  }
})

export default router
