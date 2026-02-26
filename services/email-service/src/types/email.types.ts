export type TodoCreatedEvent = {
  todoId: string;
  userId: string;
  title: string;
  description: string;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
};

export type EmailOptions = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export type UserInfo = {
  id: string;
  email: string;
  name: string;
};

