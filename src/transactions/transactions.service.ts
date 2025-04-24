import {
  BadRequestException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { TRANSACTIONS_REPOSITORY_INTERFACE_TOKEN } from './constants';
import { TransactionsRepositoryInterface } from './interfaces/transactions-repository.interface';
import { Transaction } from './entities/transaction';
import { CreateTransactionPayloadDTO } from './entities/dtos/create-transaction-payload.dto';
import { UsersService } from '../users/users.service';
import { UpdateResult } from 'typeorm';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject(TRANSACTIONS_REPOSITORY_INTERFACE_TOKEN)
    private readonly transactionsRepository: TransactionsRepositoryInterface,
    private readonly usersService: UsersService,
  ) { }

  async createTransaction(
    transaction: CreateTransactionPayloadDTO
  ): Promise<any> {
    const transactionPayload = {
      sender_id: transaction.sender_id,
      receiver_id: transaction.receiver_id,
      amount: transaction.amount,
      status: 'PENDING',
      created_at: new Date(),
    }
    const result = await this.transactionsRepository.createTransaction(transactionPayload);
    const transactionId = result.identifiers[0].id;

    const userBalance = await this.usersService.getUserBalanceById(transaction.sender_id);

    if (userBalance && userBalance >= transaction.amount) {
      const updatedTransaction = await this.usersService.updateBalanceTransaction(transaction.receiver_id, transaction.sender_id, transaction.amount);

      if (updatedTransaction) {
        await this.updateTransactionStatusToSuccess(transactionId);
        return transactionPayload;
      }
      return transactionPayload;
    }
    await this.updateTransactionStatusToFailed(transactionId);
    throw new BadRequestException(
      "Error",
      `Sorry, insufficient balance to complete the transaction`,
    );
  }

  async getTransactionById(
    transactionId: number,
  ): Promise<Transaction> {
    return this.transactionsRepository.getTransactionById(transactionId);
  }

  async getTransactionsByUserId(
    userId: number,
  ): Promise<Transaction[]> {
    return this.transactionsRepository.getTransactionsByUserId(userId);
  }

  async getTransactions(): Promise<Transaction[]> {
    return this.transactionsRepository.getTransactions();
  }

  async revertTransaction(
    transactionId: number,
  ): Promise<any> {
    const transaction = await this.transactionsRepository.getTransactionById(transactionId);
    if (transaction.status === 'SUCCESS') {
      await this.usersService.revertBalanceTransaction(transaction);
      return this.transactionsRepository.revertTransaction(transactionId);
    }
    throw new BadRequestException(
      "Error",
      `Sorry, please wait for the transaction to complete and try again`,
    );
  }

  async updateTransactionStatusToSuccess(
    transactionId: number,
  ): Promise<UpdateResult> {
    return this.transactionsRepository.updateTransactionStatusToSuccess(transactionId);
  }

  async updateTransactionStatusToFailed(
    transactionId: number,
  ): Promise<UpdateResult> {
    return this.transactionsRepository.updateTransactionStatusToFailed(transactionId);
  }
}
