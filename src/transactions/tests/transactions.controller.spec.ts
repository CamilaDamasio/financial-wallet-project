import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from '../transactions.controller';
import { TransactionsService } from '../transactions.service';
import { Transaction } from '../entities/transaction';
import { ClientGuard } from '../../guards/client.guard';
import { UsersService } from '../../users/users.service';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  const mockTransaction: Transaction = {
    id: 1,
    sender_id: 1,
    receiver_id: 2,
    amount: 50,
    created_at: new Date('2024-01-01'),
    status: 'SUCCESS'
  };

  const mockTransactionsService = {
    createTransaction: jest.fn(),
    getTransactionById: jest.fn(),
    getTransactions: jest.fn(),
    getTransactionsByUserId: jest.fn(),
    revertTransaction: jest.fn(),
  };

  const mockClientGuard = {
    canActivate: jest.fn().mockResolvedValue(true),
  };

  const mockUsersService = {
    getUserById: jest.fn().mockResolvedValue({
      id: 1,
      cpf: '12345678901',
      balance: 1000,
      name: 'John Doe',
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: ClientGuard,
          useValue: mockClientGuard,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
    jest.clearAllMocks();
  });

  describe("createTransaction", () => {
    it('should create a transaction', async () => {
      mockTransactionsService.createTransaction.mockResolvedValue(undefined);

      const payload = {
        sender_id: 1,
        receiver_id: 2,
        amount: 100,
      };

      await controller.createTransaction(payload as any);
      expect(service.createTransaction).toHaveBeenCalledWith(payload);
    });
  });

  describe("getTransaction", () => {
    it('should return a transaction by id', async () => {
      mockTransactionsService.getTransactionById.mockResolvedValue(mockTransaction);

      const result = await controller.getTransaction(1);
      expect(result).toEqual(mockTransaction);
      expect(service.getTransactionById).toHaveBeenCalledWith(1);
    });
  });

  describe("getTransactions", () => {
    it('should return all transactions', async () => {
      mockTransactionsService.getTransactions.mockResolvedValue([mockTransaction]);

      const result = await controller.getTransactions();
      expect(result).toEqual([mockTransaction]);
      expect(service.getTransactions).toHaveBeenCalled();
    });
  });

  describe("getTransactionsByUserId", () => {
    it('should return user transactions', async () => {
      mockTransactionsService.getTransactionsByUserId.mockResolvedValue([mockTransaction]);

      const result = await controller.getTransactionsByUserId(1);
      expect(result).toEqual([mockTransaction]);
      expect(service.getTransactionsByUserId).toHaveBeenCalledWith(1);
    });
  });

  describe("revertTransactionById", () => {
    it('should revert a transaction by id', async () => {
      mockTransactionsService.revertTransaction.mockResolvedValue(mockTransaction);

      const result = await controller.revertTransactionById(1);
      expect(result).toEqual(mockTransaction);
      expect(service.revertTransaction).toHaveBeenCalledWith(1);
    });
  });
});
