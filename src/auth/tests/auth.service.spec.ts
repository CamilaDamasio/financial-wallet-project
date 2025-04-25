import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = {
    id: 1,
    cpf: '12345678900',
    password: '$2b$10$hashedPassword',
  };

  const mockUsersService = {
    getUserByIdentity: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  describe("validateUser", () => {
    it('should retorn a valid token if it has correct user and password', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true as unknown as never);
      mockUsersService.getUserByIdentity.mockResolvedValueOnce(mockUser);
      mockJwtService.sign.mockReturnValue('token-jwt');

      const result = await service.validateUser('12345678900', 'senha123');

      expect(result).toEqual({ access_token: 'token-jwt' });
      expect(mockUsersService.getUserByIdentity).toHaveBeenCalledWith('12345678900');
      expect(bcrypt.compare).toHaveBeenCalledWith('senha123', mockUser.password);
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        cpf: mockUser.cpf,
      });
    });

    it('should throw UnauthorizedException if it has a incorrect password', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false as unknown as never);
      mockUsersService.getUserByIdentity.mockResolvedValueOnce(mockUser);

      await expect(
        service.validateUser('12345678900', 'senhaErrada'),
      ).rejects.toThrow(UnauthorizedException);

      expect(bcrypt.compare).toHaveBeenCalledWith('senhaErrada', mockUser.password);
    });

    it('should throw UnauthorizedException if user does not exists', async () => {
      mockUsersService.getUserByIdentity.mockResolvedValueOnce(null);

      await expect(
        service.validateUser('00000000000', 'qualquerSenha'),
      ).rejects.toThrow(UnauthorizedException);

      expect(mockUsersService.getUserByIdentity).toHaveBeenCalledWith('00000000000');
    });
  });
});
