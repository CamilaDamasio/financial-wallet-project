import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateUserPayloadDTO } from './entities/dtos/create-user-payload.dto';
import { UsersService } from './users.service';
import { User } from './entities/user';

@Controller('v1/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @Get()
  async getUsers(): Promise<User[]> {
    return await this.usersService.getUsers();
  }

  @Get(':id')
  async getUser(
    @Param('id') userId: number,
  ): Promise<User | null> {
    return await this.usersService.getUserById(userId);
  }

  @Post()
  async create(
    @Body() userPayload: CreateUserPayloadDTO,
  ): Promise<{ created: boolean }> {
    await this.usersService.createUser(userPayload);

    return {
      created: true,
    };
  }

  @Patch(':id')
  async increaseBalanceByUserId(
    @Param('id') userId: number,
    @Body() data: { amount: number },
  ): Promise<{ updated: boolean }> {
    await this.usersService.increaseBalanceByUserId(userId, data.amount);

    return {
      updated: true,
    };
  }

  @Delete(':id')
  async delete(
    @Param('id') userId: number,
  ): Promise<{ deleted: boolean }> {
    await this.usersService.deleteUserById(userId);

    return {
      deleted: true,
    };
  }
}
