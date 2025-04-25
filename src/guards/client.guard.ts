import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class ClientGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.user;

    const user = await this.usersService.getUserById(userId);
    if (!user || user.rule !== 'client') {
      throw new ForbiddenException('Only clients can perform this action.');
    }
    return true;
  }
}
