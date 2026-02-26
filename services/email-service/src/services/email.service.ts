import { getTransporter } from "../config/email.config"
import { TodoCreatedEvent, EmailOptions } from "../types/email.types"
import { getUserInfo, formatDate } from "../utils/utils"

// Send email using Nodemailer
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const transporter = getTransporter()

    if (!transporter) {
      console.error("Email transporter not initialized")
      return
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@todoapp.com",
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html || options.text,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent successfully:", info.messageId)
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}

// Handle todo created event
export const handleTodoCreated = async (
  event: TodoCreatedEvent
): Promise<void> => {
  try {
    // Fetch user information
    //@ts-ignore
    const user: UserInfo = await getUserInfo(event)

    if (!user || !user.email) {
      console.error(
        "User not found or email not available for userId:",
        event.userId
      )
      return
    }

    // Prepare email content
    const subject = `New Todo Created: ${event.title}`
    const text = `
        Hello ${user.name},

        A new todo has been created in your account:

        Title: ${event.title}
        Description: ${event.description}
        Priority: ${event.priority}
        Due Date: ${formatDate(event.dueDate)}

        Best regards,
        Todo App Team
            `

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
            .todo-info { margin: 20px 0; }
            .todo-info-item { margin: 10px 0; }
            .label { font-weight: bold; color: #555; }
            .priority-${event.priority} { 
              display: inline-block;
              padding: 5px 10px;
              border-radius: 3px;
              color: white;
              font-weight: bold;
            }
            .priority-low { background-color: #2196F3; }
            .priority-medium { background-color: #FF9800; }
            .priority-high { background-color: #F44336; }
            .footer { text-align: center; margin-top: 20px; color: #777; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Todo Created</h1>
            </div>
            <div class="content">
              <p>Hello <strong>${user.name}</strong>,</p>
              <p>A new todo has been created in your account:</p>
              
              <div class="todo-info">
                <div class="todo-info-item">
                  <span class="label">Title:</span> ${event.title}
                </div>
                <div class="todo-info-item">
                  <span class="label">Description:</span> ${
                    event.description || "No description"
                  }
                </div>
                <div class="todo-info-item">
                  <span class="label">Priority:</span> 
                  <span class="priority-${
                    event.priority
                  }">${event.priority.toUpperCase()}</span>
                </div>
                <div class="todo-info-item">
                  <span class="label">Due Date:</span> ${formatDate(
                    event.dueDate
                  )}
                </div>
              </div>
              
              <p>Don't forget to complete your task on time!</p>
            </div>
            <div class="footer">
              <p>&copy; 2026 Todo App. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
    `

    // Send email
    await sendEmail({
      to: user.email,
      subject,
      text,
      html,
    })

    console.log(`Todo creation email sent to ${user.email}`)
  } catch (error) {
    console.error("Error handling todo created event:", error)
    throw error
  }
}
