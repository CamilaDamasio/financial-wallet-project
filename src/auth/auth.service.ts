import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(cpf: string, pass: string): Promise<any> {
    const user = await this.usersService.getUserByIdentity(cpf);
    if (user) {
      const isMatch = await bcrypt.compare(pass, user.password);
      if (isMatch) {
        const payload = { sub: user.id, cpf: user.cpf };
        const access_token = this.jwtService.sign(payload);
        return { access_token };
      }
    }
    throw new UnauthorizedException('Senha e/ou Usuário inválidos');
  }
}