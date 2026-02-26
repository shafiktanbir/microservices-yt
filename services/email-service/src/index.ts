import express, { Application } from "express"
import cors from "cors"
import dotenv from "dotenv"
import { initializeEmailTransporter } from "./config/email.config"
import {
  closeRabbitMQ,
  connectRabbitMQ,
  consumeFromQueue,
} from "./config/rabbitmq"

dotenv.config()

const app: Application = express()
const PORT = process.env.PORT || 3003

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "email-service" })
})

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down Email Service...")
  closeRabbitMQ()
  process.exit(0)
})

// Start server
const startServer = async (): Promise<void> => {
  try {
    initializeEmailTransporter()
    await connectRabbitMQ()
    await consumeFromQueue()
    app.listen(PORT, () => {
      console.log(`Email Service running on port ${PORT}`)
    })
  } catch (error) {
    console.error("Failed to start Email Service:", error)
    process.exit(1)
  }
}

startServer()
