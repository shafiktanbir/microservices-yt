import express, { Application } from "express"
import cors from "cors"
import dotenv from "dotenv"
import { connectDatabase } from "./config/database"
import todoRoutes from "./routes/todo.routes"
import cookieParser from "cookie-parser"
import { closeRabbitMQ, connectRabbitMQ } from "./config/rabbitmq"

dotenv.config()

const app: Application = express()
const PORT = process.env.PORT || 3002

// Middleware
app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/todos", todoRoutes)

// Health check endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "todo-service" })
})

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down Todo Service...")
  await closeRabbitMQ()
  process.exit(0)
})

// Start server
const startServer = async (): Promise<void> => {
  try {
    await connectDatabase()
    await connectRabbitMQ()
    app.listen(PORT, () => {
      console.log(`Todo Service running on port ${PORT}`)
    })
  } catch (error) {
    console.error("Failed to start Todo Service:", error)
    process.exit(1)
  }
}

startServer()
