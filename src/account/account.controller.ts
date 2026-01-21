import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  NotFoundException,
  Post,
  Body,
  Put,
} from '@nestjs/common';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import type { UserWithoutPassword } from 'src/auth/auth.service';
import { AccountService } from './account.service';
import { AccountDto, UpdateAccountDto } from './dto/account.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  @Get()
  getAccounts(@GetUser() user: UserWithoutPassword) {
    return this.accountService.getAccounts(user.id);
  }

  @Get(':id')
  async getAccountId(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) accountId: number,
  ) {
    const account = await this.accountService.getAccountById(accountId, userId);
    if (!account) {
      throw new NotFoundException('Account not found or access denied');
    }
    return account;
  }

  @Post()
  async createAccount(@GetUser('id') userId: number, @Body() body: AccountDto) {
    return this.accountService.createAccount(userId, body.name, body.amount);
  }

  @Put(':id')
  async updateAccount(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) accountId: number,
    @Body() body: UpdateAccountDto,
  ) {
    const account = await this.accountService.updateAccount(
      userId,
      accountId,
      body,
    );
    if (!account) {
      throw new NotFoundException('Account not found or access denied');
    }
    return { ...account, ...body };
  }
}
