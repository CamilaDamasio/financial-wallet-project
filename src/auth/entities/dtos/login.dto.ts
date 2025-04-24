import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class LoginDTO {
  @IsNumberString()
  @IsNotEmpty()
  cpf: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
