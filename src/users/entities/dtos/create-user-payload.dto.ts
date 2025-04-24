import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUserPayloadDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  cpf: number;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  dateOfBirth: string;

  @IsNotEmpty()
  rule: string;

  createdAt: Date;

  updatedAt: Date;
}
