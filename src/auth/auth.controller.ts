import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDTO } from "./entities/dtos/login.dto";

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() { cpf, password }: LoginDTO) {
    const token = await this.authService.validateUser(cpf, password);
    if (!token) {
      throw new UnauthorizedException('CPF ou senha inválidos');
    }
    return token;
  }
}