import { title } from "process"
import { Todo, TodoDocument } from "../models/todo.model"
import { CreateTodoDTO } from "../types/todo.types"
import { publishToQueue } from "../config/rabbitmq"

// Create a new todo
export const createTodo = async (userId: string, todoData: CreateTodoDTO) => {
  try {
    const todo = new Todo({
      ...todoData,
      userId,
    })

    await todo.save()

    const event = {
      todoId: todo._id.toString(),
      userId: todo.userId,
      title: todo.title,
      description: todo.description,
      dueDate: todo.dueDate,
      priority: todo.priority,
    }

    await publishToQueue("todo_created", event)

    return todo
  } catch (error) {
    throw error
  }
}
