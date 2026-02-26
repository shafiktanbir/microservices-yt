import express, { Application } from "express"
import cors from "cors"
import dotenv from "dotenv"
import { connectDatabase } from "./config/database"
import userRoutes from "./routes/user.routes"
import cookieParser from "cookie-parser"

dotenv.config()

const app: Application = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/users", userRoutes)

// Health check endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "user-service" })
})

// Start server
const startServer = async (): Promise<void> => {
  try {
    await connectDatabase()
    app.listen(PORT, () => {
      console.log(`User Service running on port ${PORT}`)
    })
  } catch (error) {
    console.error("Failed to start User Service:", error)
    process.exit(1)
  }
}

startServer()
