import { ConflictException, HttpException, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { UsersRepositoryInterface } from '../../interfaces/users-repository.interface';
import { Repository } from 'typeorm';
import { User } from '../../entities/user';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersSchema } from './schemas/user.schema';

export class UsersRepository
  implements UsersRepositoryInterface {
  constructor(
    @InjectRepository(UsersSchema)
    private readonly usersModel: Repository<User>,
  ) { }

  async getUserById(userId: number): Promise<User> {
    try {
      const user = await this.usersModel.findOne({
        where: {
          id: userId,
        },
      });
      if (!user) {
        throw new NotFoundException(
          "Not Found",
          `User ${userId} does not exist`,
        );
      }
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Unexpected error occurred');
    }
  }

  async getUserByIdentity(cpf: string): Promise<User> {
    try {
      const user = await this.usersModel.findOne({
        where: {
          cpf: cpf,
        },
      });
      if (!user) {
        throw new NotFoundException(
          "Not Found",
          `User with identity ${cpf} does not exist`,
        );
      }
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Unexpected error occurred');
    }
  }

  async updateBalanceByUserId(userId: number, amount: number): Promise<void> {
    try {
      await this.usersModel.update(
        { id: userId },
        { balance: amount },
      );
      return;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Unexpected error occurred');
    }
  }

  async getUsers(): Promise<User[]> {
    return this.usersModel.find({});
  }

  async createUser(
    userPayload: any,
  ): Promise<void> {
    try {
      await this.usersModel.insert(userPayload);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error.code === '23505') {
        throw new ConflictException('Este CPF já está cadastrado');
      }

      throw new InternalServerErrorException('Unexpected error occurred');
    }
  }

  async deleteUserById(userId: number): Promise<void> {
    await this.usersModel.delete({
      id: userId,
    })
  }
}
