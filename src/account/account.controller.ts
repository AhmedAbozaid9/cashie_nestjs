import { Controller, Get } from '@nestjs/common';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import type { UserWithoutPassword } from 'src/auth/auth.service';

@Controller('account')
export class AccountController {
  @Get()
  getAccountInfo(@GetUser() user: UserWithoutPassword) {
    return user;
  }

  @Get('id')
  getAccountId(@GetUser('id') id: number) {
    return { id };
  }
}
