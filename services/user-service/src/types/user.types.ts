export type CreateUserDTO = {
  email: string;
  password: string;
  name: string;
};

export type LoginDTO = {
  email: string;
  password: string;
};

export type UserResponse = {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
};

export type AuthResponse = {
  token: string;
  user: UserResponse;
};

