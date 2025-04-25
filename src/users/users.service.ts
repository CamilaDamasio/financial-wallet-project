import {
  Inject,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { USERS_REPOSITORY_INTERFACE_TOKEN } from './constants/ioc';
import { UsersRepositoryInterface } from './interfaces/users-repository.interface';
import { User } from './entities/user';
import { CreateUserPayloadDTO } from './entities/dtos/create-user-payload.dto';
import { Transaction } from '../transactions/entities/transaction';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY_INTERFACE_TOKEN)
    private readonly usersRepository: UsersRepositoryInterface,
  ) { }

  async getUsers(
  ): Promise<User[]> {
    return this.usersRepository.getUsers();
  }

  async getUserById(
    userId: number,
  ): Promise<User | null> {
    return this.usersRepository.getUserById(userId);
  }

  async getUserByIdentity(
    cpf: string,
  ): Promise<User | null> {
    return this.usersRepository.getUserByIdentity(cpf);
  }

  async createUser(
    userPayload: CreateUserPayloadDTO,
  ): Promise<void> {
    const [day, month, year] = userPayload.dateOfBirth.split("/");
    const dateOfBirth = new Date(Number(year), Number(month) - 1, Number(day));

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userPayload.password, saltRounds);
    const user = {
      name: userPayload.name,
      cpf: userPayload.cpf,
      password: hashedPassword,
      date_of_birth: new Date(dateOfBirth),
      rule: userPayload.rule,
      balance: 0,
      created_at: new Date(),
      updated_at: new Date()
    };
    return this.usersRepository.createUser(user);
  }

  async deleteUserById(
    userId: number,
  ): Promise<void> {
    return this.usersRepository.deleteUserById(userId);
  }

  async increaseBalanceByUserId(user_id: number, amount: number) {
    const userData = await this.usersRepository.getUserById(user_id);
    const newUserAmount = Number(userData.balance) + Number(amount);
    await this.usersRepository.updateBalanceByUserId(user_id, Number(newUserAmount));
  }

  async updateBalanceTransaction(receiver_id: number, sender_id: number, amount: number) {
    const senderData = await this.usersRepository.getUserById(sender_id);
    const newSenderAmount = Number(senderData.balance) - Number(amount);
    await this.usersRepository.updateBalanceByUserId(sender_id, newSenderAmount);

    const receiverData = await this.usersRepository.getUserById(receiver_id);
    const newReceiverAmount = Number(receiverData.balance) + Number(amount);
    await this.usersRepository.updateBalanceByUserId(receiver_id, Number(newReceiverAmount));

    return true;
  }

  async revertBalanceTransaction(transaction: Transaction): Promise<void> {
    const senderData = await this.usersRepository.getUserById(transaction.sender_id);
    const newSenderAmount = Number(senderData.balance) + Number(transaction.amount);
    await this.usersRepository.updateBalanceByUserId(transaction.sender_id, newSenderAmount);

    const receiverData = await this.usersRepository.getUserById(transaction.receiver_id);
    const newReceiverAmount = Number(receiverData.balance) - Number(transaction.amount);
    await this.usersRepository.updateBalanceByUserId(transaction.receiver_id, Number(newReceiverAmount));
  }

  async getUserBalanceById(userId: number) {
    const user = await this.getUserById(userId);
    return user?.balance;
  }
}
