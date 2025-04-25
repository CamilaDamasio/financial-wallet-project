import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users.service';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: any;

  beforeEach(() => {
    usersRepository = {
      getUsers: jest.fn(),
      getUserById: jest.fn(),
      getUserByIdentity: jest.fn(),
      createUser: jest.fn(),
      deleteUserById: jest.fn(),
      updateBalanceByUserId: jest.fn(),
    };

    service = new UsersService(usersRepository);
  });

  describe('getUsers', () => {
    it('should retorn all users', async () => {
      const mockUsers = [{ id: 1 }, { id: 2 }];
      usersRepository.getUsers.mockResolvedValue(mockUsers);

      const result = await service.getUsers();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('getUserById', () => {
    it('should retorn a user by id', async () => {
      const user = { id: 1, name: 'Camila' };
      usersRepository.getUserById.mockResolvedValue(user);

      const result = await service.getUserById(1);
      expect(result).toEqual(user);
    });
  });

  describe('createUser', () => {
    it('should create user with encrypted password', async () => {
      const dto = {
        name: 'Camila',
        cpf: '12345678900',
        password: 'senha123',
        dateOfBirth: '01/01/2000',
        rule: 'user',
        created_at: new Date(),
        updated_at: new Date(),
      };

      usersRepository.createUser.mockResolvedValue(undefined);
      const hashSpy = jest.spyOn(bcrypt, 'hash');

      await service.createUser(dto);

      expect(usersRepository.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Camila',
          cpf: '12345678900',
          rule: 'user',
          balance: 0,
        }),
      );
      expect(hashSpy).toHaveBeenCalled();
    });
  });

  describe('increaseBalanceByUserId', () => {
    it('should increase user balance', async () => {
      usersRepository.getUserById.mockResolvedValue({ balance: 100 });
      usersRepository.updateBalanceByUserId.mockResolvedValue(undefined);

      await service.increaseBalanceByUserId(1, 50);

      expect(usersRepository.updateBalanceByUserId).toHaveBeenCalledWith(1, 150);
    });
  });

  describe('updateBalanceTransaction', () => {
    it('should transfer balance between users', async () => {
      usersRepository.getUserById
        .mockResolvedValueOnce({ balance: 200 })
        .mockResolvedValueOnce({ balance: 100 });

      await service.updateBalanceTransaction(2, 1, 50);

      expect(usersRepository.updateBalanceByUserId).toHaveBeenNthCalledWith(1, 1, 150);
      expect(usersRepository.updateBalanceByUserId).toHaveBeenNthCalledWith(2, 2, 150);
    });
  });

  describe('revertBalanceTransaction', () => {
    it('should revert transaction balance', async () => {
      const transaction = {
        sender_id: 1,
        receiver_id: 2,
        amount: 30,
      };

      usersRepository.getUserById
        .mockResolvedValueOnce({ balance: 100 })
        .mockResolvedValueOnce({ balance: 200 });

      await service.revertBalanceTransaction(transaction as any);

      expect(usersRepository.updateBalanceByUserId).toHaveBeenNthCalledWith(1, 1, 130);
      expect(usersRepository.updateBalanceByUserId).toHaveBeenNthCalledWith(2, 2, 170);
    });
  });

  describe('getUserBalanceById', () => {
    it('should retorn user balance', async () => {
      const user = { id: 1, balance: 999 };
      jest.spyOn(service, 'getUserById').mockResolvedValue(user as any);

      const result = await service.getUserBalanceById(1);
      expect(result).toBe(999);
    });
  });
});
