import amqp from "amqplib"

export type RabbitMQConfig = {
  url?: string
  queues?: string[]
  serviceName?: string
}

class RabbitMQClient {
  private config: any
  private connection: any
  private channel: any
  constructor(config: RabbitMQConfig = {}) {
    this.config = config
  }

  async connect() {
    try {
      const rabbitMQUrl = this.config.url || "amqp://localhost:5672"
      this.connection = await amqp.connect(rabbitMQUrl)
      this.channel = this.connection.createChannel()

      if (this.config.queues) {
        for (const queue of this.config.queues) {
          await this.channel.assertQueue(queue, { durable: true })
        }
      }
      const serviceName = this.config.serviceName || "Service"
      console.log(`${serviceName}: RabbitMQ connected successfully`)
    } catch (error) {
      const serviceName = this.config.serviceName || "Service"
      console.error(`${serviceName}: RabbitMQ connection error:`, error)
    }
  }

  async publishToQueue(queue: string, message: object) {
    try {
      if (!this.channel) {
        console.error("RabbitMQ channel not available")
        return false
      }

      await this.channel.assertQueue(queue, { durable: true })
      this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
        persistent: true,
      })
      console.log(`Message published to queue ${queue}:`, message)
      return true
    } catch (error) {
      console.error("Error publishing message to queue")
      return false
    }
  }

  async consumeFromQueue(
    queue: string,
    handler: (message: any) => Promise<void>,
    options: { noAck?: boolean } = { noAck: false }
  ) {
    try {
      if (!this.channel) {
        console.error("RabbitMQ channel not available")
        return
      }
      await this.channel.assertQueue(queue, { durable: true })
      this.channel.consume(queue, async (msg: any) => {
        if (msg) {
          try {
            const content = JSON.parse(msg.content.toString())
            await handler(content)
            if (!options.noAck) {
              this.channel?.ack(msg)
            }
            console.log(`Started consuming from queue: ${queue}`)
          } catch (error) {
            console.error("Error consuming message to queue")
            return false
          }
        }
      })
    } catch (error) {
      console.error("Error publishing message to queue")
      return false
    }
  }

  getChannel() {
    return this.channel
  }

  isConnected() {
    return this.channel !== null && this.connection !== null
  }

  async close(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close()
        this.channel = null
      }
      if (this.connection) {
        await this.connection.close()
        this.connection = null
      }
      console.log("RabbitMQ connection closed")
    } catch (error) {
      console.error("Error closing RabbitMQ connection:", error)
    }
  }
}

export default RabbitMQClient
