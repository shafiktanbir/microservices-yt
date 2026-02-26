import RabbitMQClient from "@tanuj_malode/rabbitmq"

const rabbitMQ = new RabbitMQClient({
  serviceName: "Todo Service",
  queues: ["todo_created"],
})

export const publishToQueue = async (queue: string, message: object) => {
  await rabbitMQ.publishToQueue(queue, message)
}

export const connectRabbitMQ = async () => rabbitMQ.connect()
export const closeRabbitMQ = async () => rabbitMQ.close()
