export type CreateTodoDTO = {
    title: string;
    description?: string;
    dueDate?: Date;
    priority?: "low" | "medium" | "high";
};
export type UpdateTodoDTO = {
    title?: string;
    description?: string;
    completed?: boolean;
    dueDate?: Date;
    priority?: "low" | "medium" | "high";
};
export type TodoCreatedEvent = {
    todoId: string;
    userId: string;
    title: string;
    description: string;
    dueDate?: Date;
    priority: "low" | "medium" | "high";
};
//# sourceMappingURL=todo.types.d.ts.map