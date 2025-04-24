import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTransactionPayloadDTO {
  @IsString()
  @IsNotEmpty()
  sender_id: number;

  @IsNumber()
  @IsNotEmpty()
  receiver_id: number;

  @IsString()
  @IsNotEmpty()
  amount: number;
}
