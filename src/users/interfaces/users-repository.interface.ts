import { User } from '../entities/user';

export interface UsersRepositoryInterface {
  getUserById(userId: number): Promise<User>;

  getUserByIdentity(cpf: string): Promise<User>;

  getUsers(): Promise<User[]>;

  createUser(userPayload: any): Promise<void>;

  deleteUserById(userId: number): Promise<void>;

  updateBalanceByUserId(userId: number, amount: number): Promise<void>;
}
