import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { UsersController } from '../users.controller';
import { User } from '../entities/user';
import { RulesEnum } from '../infra/database/schemas/user.schema';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser: User = {
    id: 1,
    name: 'João',
    cpf: '12345678900',
    password: 'hashed-password',
    balance: 100.0,
    date_of_birth: new Date('1990-01-01'),
    rule: RulesEnum.CLIENT,
  };

  const mockUsersService = {
    getUsers: jest.fn(),
    getUserById: jest.fn(),
    createUser: jest.fn(),
    increaseBalanceByUserId: jest.fn(),
    deleteUserById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe("getUsers", () => {
    it('should return all users', async () => {
      mockUsersService.getUsers.mockResolvedValue([mockUser]);

      const result = await controller.getUsers();
      expect(result).toEqual([mockUser]);
      expect(service.getUsers).toHaveBeenCalled();
    });
  });

  describe("getUser", () => {
    it('should return a user by id', async () => {
      mockUsersService.getUserById.mockResolvedValue(mockUser);

      const result = await controller.getUser(1);
      expect(result).toEqual(mockUser);
      expect(service.getUserById).toHaveBeenCalledWith(1);
    });
  });

  describe("create", () => {
    it('should create a new user', async () => {
      mockUsersService.createUser.mockResolvedValue(undefined);

      const payload = {
        name: 'Maria',
        cpf: '98765432100',
        password: '123456',
        date_of_birth: new Date('1995-05-20'),
      };

      const result = await controller.create(payload as any);
      expect(result).toEqual({ created: true });
      expect(service.createUser).toHaveBeenCalledWith(payload);
    });
  });

  describe("increaseBalanceByUserId", () => {
    it('should increase balance of user', async () => {
      mockUsersService.increaseBalanceByUserId.mockResolvedValue(undefined);

      const result = await controller.increaseBalanceByUserId(1, { amount: 50 });
      expect(result).toEqual({ updated: true });
      expect(service.increaseBalanceByUserId).toHaveBeenCalledWith(1, 50);
    });
  });

  describe("delete", () => {
    it('should delete a user by id', async () => {
      mockUsersService.deleteUserById.mockResolvedValue(undefined);

      const result = await controller.delete(1);
      expect(result).toEqual({ deleted: true });
      expect(service.deleteUserById).toHaveBeenCalledWith(1);
    });
  });
});
