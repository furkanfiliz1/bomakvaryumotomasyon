export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  username: string;
  password: string;
}
