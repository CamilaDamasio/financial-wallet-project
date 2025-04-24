import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transaction } from './entities/transaction';
import { CreateTransactionPayloadDTO } from './entities/dtos/create-transaction-payload.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('v1/transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
  ) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createTransaction(
    @Body() transactionPayload: CreateTransactionPayloadDTO,
  ): Promise<void> {
    return await this.transactionsService.createTransaction(transactionPayload);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':transactionId')
  async getTransaction(
    @Param('transactionId') transactionId: number,
  ): Promise<Transaction> {
    return await this.transactionsService.getTransactionById(transactionId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getTransactions(): Promise<Transaction[]> {
    return await this.transactionsService.getTransactions();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user/:userId')
  async getTransactionsByUserId(
    @Param('userId') userId: number,
  ): Promise<Transaction[]> {
    return await this.transactionsService.getTransactionsByUserId(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('revert/:transactionId')
  async revertTransactionById(
    @Param('transactionId') transactionId: number,
  ): Promise<Transaction> {
    return await this.transactionsService.revertTransaction(transactionId);
  }
}
