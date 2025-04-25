import { BadRequestException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { TransactionsRepositoryInterface } from '../interfaces/transactions-repository.interface';
import { TransactionsService } from '../transactions.service';
import { InsertResult, UpdateResult } from 'typeorm';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactionsRepository: jest.Mocked<TransactionsRepositoryInterface>;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(() => {
    transactionsRepository = {
      createTransaction: jest.fn(),
      getTransactionById: jest.fn(),
      getTransactionsByUserId: jest.fn(),
      getTransactions: jest.fn(),
      updateTransactionStatusToSuccess: jest.fn(),
      updateTransactionStatusToFailed: jest.fn(),
      revertTransaction: jest.fn(),
    } as any;

    usersService = {
      getUserBalanceById: jest.fn(),
      updateBalanceTransaction: jest.fn(),
      revertBalanceTransaction: jest.fn(),
    } as any;

    service = new TransactionsService(transactionsRepository, usersService);
  });

  describe('createTransaction', () => {
    it('should create a transaction with success when balance is sufficient', async () => {
      const payload = {
        sender_id: 1,
        receiver_id: 2,
        amount: 100,
      };

      transactionsRepository.createTransaction.mockResolvedValue({
        identifiers: [{ id: 1 }],
      } as unknown as InsertResult);
      usersService.getUserBalanceById.mockResolvedValue(200);
      usersService.updateBalanceTransaction.mockResolvedValue(true);
      transactionsRepository.updateTransactionStatusToSuccess.mockResolvedValue({} as unknown as UpdateResult);

      const result = await service.createTransaction(payload);

      expect(transactionsRepository.createTransaction).toHaveBeenCalled();
      expect(usersService.getUserBalanceById).toHaveBeenCalledWith(1);
      expect(usersService.updateBalanceTransaction).toHaveBeenCalled();
      expect(transactionsRepository.updateTransactionStatusToSuccess).toHaveBeenCalledWith(1);
      expect(result.status).toBe('PENDING');
    });

    it('should throw exception if the balance is insufficient', async () => {
      const payload = {
        sender_id: 1,
        receiver_id: 2,
        amount: 100,
      };

      transactionsRepository.createTransaction.mockResolvedValue({
        identifiers: [{ id: 1 }],
      } as unknown as InsertResult);
      usersService.getUserBalanceById.mockResolvedValue(50);
      transactionsRepository.updateTransactionStatusToFailed.mockResolvedValue({} as unknown as UpdateResult);

      await expect(service.createTransaction(payload)).rejects.toThrow(BadRequestException);
      expect(transactionsRepository.updateTransactionStatusToFailed).toHaveBeenCalledWith(1);
    });
  });

  describe('getTransactionById', () => {
    it('should return a transaction by transaction id', async () => {
      const mockTransaction = { id: 1, amount: 100 };
      transactionsRepository.getTransactionById.mockResolvedValue(mockTransaction as any);

      const result = await service.getTransactionById(1);
      expect(result).toEqual(mockTransaction);
    });
  });

  describe('getTransactionsByUserId', () => {
    it('should return transactions by user', async () => {
      const mockTransactions = [{ id: 1 }, { id: 2 }];
      transactionsRepository.getTransactionsByUserId.mockResolvedValue(mockTransactions as any);

      const result = await service.getTransactionsByUserId(1);
      expect(result).toEqual(mockTransactions);
    });
  });

  describe('revertTransaction', () => {
    it('should revert a transaction with success', async () => {
      const transaction = { id: 1, status: 'SUCCESS' };
      transactionsRepository.getTransactionById.mockResolvedValue(transaction as any);
      usersService.revertBalanceTransaction.mockResolvedValue(undefined);
      transactionsRepository.revertTransaction.mockResolvedValue(transaction as any);

      const result = await service.revertTransaction(1);
      expect(result).toEqual(transaction);
    });

    it('should throw exception if transaction not has SUCCESS status', async () => {
      const transaction = { id: 1, status: 'FAILED' };
      transactionsRepository.getTransactionById.mockResolvedValue(transaction as any);

      await expect(service.revertTransaction(1)).rejects.toThrow(BadRequestException);
    });
  });
});
