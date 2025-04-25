import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from '../auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe("login", () => {
    it('should return token when it has valid credentials', async () => {
      const tokenMock = { access_token: 'valid_token' };
      mockAuthService.validateUser.mockResolvedValue(tokenMock);

      const result = await controller.login({ cpf: '12345678900', password: 'senha123' });
      expect(result).toEqual(tokenMock);
      expect(authService.validateUser).toHaveBeenCalledWith('12345678900', 'senha123');
    });

    it('should throw UnauthorizedException if it has invalid credentials', async () => {
      mockAuthService.validateUser.mockResolvedValue(null);

      await expect(
        controller.login({ cpf: '00000000000', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);

      expect(authService.validateUser).toHaveBeenCalledWith('00000000000', 'wrong');
    });
  });
});
