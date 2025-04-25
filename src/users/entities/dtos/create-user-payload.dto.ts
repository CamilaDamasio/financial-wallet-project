import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUserPayloadDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  cpf: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  dateOfBirth: string;

  @IsNotEmpty()
  rule: string;

  created_at: Date;

  updated_at: Date;
}
