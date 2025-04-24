import { Module } from '@nestjs/common';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TransactionsSchema } from './infra/database/schemas/transaction.schema';
import { TransactionsRepository } from './infra/database/transactions.repository';
import { TransactionsService } from './transactions.service';
import { TRANSACTIONS_REPOSITORY_INTERFACE_TOKEN } from './constants';
import { TransactionsController } from './transactions.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionsSchema]),
    UsersModule,
  ],
  providers: [
    {
      provide: TRANSACTIONS_REPOSITORY_INTERFACE_TOKEN,
      useFactory: (dataSource: DataSource) => {
        return new TransactionsRepository(
          dataSource.getRepository('Transaction'),
        );
      },
      inject: [getDataSourceToken()],
    },
    TransactionsService,
  ],
  controllers: [TransactionsController],
  exports: [TRANSACTIONS_REPOSITORY_INTERFACE_TOKEN, TransactionsService],
})
export class TransactionsModule { }
