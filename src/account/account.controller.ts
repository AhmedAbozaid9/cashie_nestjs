import { Controller, Get } from '@nestjs/common';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import type { UserWithoutPassword } from 'src/auth/auth.service';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  @Get()
  getAccounts(@GetUser() user: UserWithoutPassword) {
    return this.accountService.getAccounts(user.id);
  }

  @Get('id')
  getAccountId(@GetUser('id') id: number) {
    return { id };
  }
}
