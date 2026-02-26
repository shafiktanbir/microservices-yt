import { TodoDocument } from "../models/todo.model";
import { CreateTodoDTO } from "../types/todo.types";
export declare const createTodo: (userId: string, todoData: CreateTodoDTO) => Promise<import("mongoose").Document<unknown, {}, TodoDocument, {}, {}> & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & {
    title: string;
    description: string;
    completed: boolean;
    userId: string;
    dueDate?: Date;
    priority: "low" | "medium" | "high";
    createdAt: Date;
    updatedAt: Date;
} & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
//# sourceMappingURL=todo.service.d.ts.map