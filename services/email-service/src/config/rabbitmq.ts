import RabbitMQClient from "@tanuj_malode/rabbitmq"
import { handleTodoCreated } from "../services/email.service"

const rabbitMQ = new RabbitMQClient({
  serviceName: "Todo Service",
  queues: ["todo_created"],
})

export const consumeFromQueue = async () => {
  await rabbitMQ.consumeFromQueue(
    "todo_created",
    async (event: any) => {
      console.log("Received todo_created event:", event)
      await handleTodoCreated(event)
    },
    { noAck: false }
  )
}

export const connectRabbitMQ = async () => rabbitMQ.connect()
export const closeRabbitMQ = async () => rabbitMQ.close()
