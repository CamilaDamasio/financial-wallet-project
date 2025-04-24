import { InsertResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionsSchema } from './schemas/transaction.schema';
import { Transaction } from '../../entities/transaction';
import { TransactionsRepositoryInterface } from '../../interfaces/transactions-repository.interface';
import { HttpException, InternalServerErrorException, NotFoundException } from '@nestjs/common';

export class TransactionsRepository
  implements TransactionsRepositoryInterface {
  constructor(
    @InjectRepository(TransactionsSchema)
    private readonly transactionsModel: Repository<Transaction>,
  ) { }

  async createTransaction(transactionPayload: Transaction): Promise<InsertResult> {
    return await this.transactionsModel.insert(transactionPayload);
  }

  async getTransactionById(transactionId: number): Promise<Transaction> {
    try {
      const transaction = await this.transactionsModel.findOne({
        where: {
          id: transactionId,
        },
      });
      if (!transaction) {
        throw new NotFoundException(
          "Not Found",
          `Transaction ${transactionId} does not exist`,
        );
      }
      return transaction;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Unexpected error occurred');
    }
  }

  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    try {
      const userTransactions = await this.transactionsModel.find({
        where: [
          { receiver_id: userId },
          { sender_id: userId },
        ],
      });
      if (!userTransactions) {
        throw new NotFoundException(
          "Not Found",
          `Does not have transactions of user: ${userId}`,
        );
      }
      return userTransactions;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Unexpected error occurred');
    }
  }

  async getTransactions(): Promise<Transaction[]> {
    try {
      const transactions = await this.transactionsModel.find({});
      if (!transactions) {
        throw new NotFoundException(
          "Not Found",
          `Transactions does not exist`,
        );
      }
      return transactions;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Unexpected error occurred');
    }
  }

  async revertTransaction(transactionId: number): Promise<UpdateResult> {
    try {
      const transaction = await this.transactionsModel.update(
        { id: transactionId },
        { reversed_at: new Date() }
      );
      if (!transaction) {
        throw new NotFoundException(
          "Not Found",
          `Transaction ${transactionId} does not exist`,
        );
      }
      return transaction;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Unexpected error occurred');
    }
  }

  async updateTransactionStatusToSuccess(transactionId: number): Promise<UpdateResult> {
    try {
      const transaction = await this.transactionsModel.update(
        {
          id: transactionId,
        },
        {
          status: 'SUCCESS',
        }
      );
      if (!transaction) {
        throw new NotFoundException(
          "Not Found",
          `Transaction does not exist`,
        );
      }
      return transaction;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Unexpected error occurred');
    }
  }

  async updateTransactionStatusToFailed(transactionId: number): Promise<UpdateResult> {
    try {
      const transaction = await this.transactionsModel.update(
        {
          id: transactionId,
        },
        {
          status: 'FAILED',
        }
      );
      if (!transaction) {
        throw new NotFoundException(
          "Not Found",
          `Transaction does not exist`,
        );
      }
      return transaction;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Unexpected error occurred');
    }
  }
}
