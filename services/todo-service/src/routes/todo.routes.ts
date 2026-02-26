import { Router, Response } from "express"
import { createTodo } from "../services/todo.service"
import { authenticateToken, AuthRequest } from "../middleware/auth.middleware"

const router = Router()

// All routes require authentication
router.use(authenticateToken)

// Create a new todo
router.post("/", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, dueDate, priority } = req.body

    if (!title) {
      res.status(400).json({ error: "Title is required" })
      return
    }

    const todo = await createTodo(req.userId!, {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      priority,
    })

    res.status(201).json(todo)
  } catch (error) {
    const err = error as Error
    res.status(500).json({ error: err.message })
  }
})

export default router
