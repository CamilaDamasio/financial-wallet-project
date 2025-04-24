import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { USERS_REPOSITORY_INTERFACE_TOKEN } from './constants';
import { UsersService } from './users.service';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './infra/database/users-repository';
import { UsersSchema } from './infra/database/schemas/user.schema';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersSchema]),
  ],
  providers: [
    {
      provide: USERS_REPOSITORY_INTERFACE_TOKEN,
      useFactory: (dataSource: DataSource) => {
        return new UsersRepository(
          dataSource.getRepository('User'),
        );
      },
      inject: [getDataSourceToken()],
    },
    UsersService,
  ],
  controllers: [UsersController],
  exports: [USERS_REPOSITORY_INTERFACE_TOKEN, UsersService],
})
export class UsersModule { }
