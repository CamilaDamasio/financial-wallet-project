import { InsertResult, UpdateResult } from "typeorm";
import { Transaction } from "../entities/transaction";

export interface TransactionsRepositoryInterface {
  createTransaction(transaction: Transaction): Promise<InsertResult>;
  getTransactionById(transactionId: number): Promise<Transaction>;
  revertTransaction(transactionId: number): Promise<UpdateResult>;
  getTransactions(): Promise<Transaction[]>;
  getTransactionsByUserId(userId: number): Promise<Transaction[]>;
  updateTransactionStatusToSuccess(transactionId: number): Promise<UpdateResult>;
  updateTransactionStatusToFailed(transactionId: number): Promise<UpdateResult>;
}
