import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { handlePrismaError } from 'src/common/prisma-errors';
@Injectable()
export class AccountService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAccounts(userId: number) {
    try {
      const accounts = await this.prismaService.account.findMany({
        where: { userId },
      });
      return accounts;
    } catch (error: unknown) {
      handlePrismaError(error);
      console.error(error);
      throw error;
    }
  }
  async getAccountById(accountId: number, userId: number) {
    try {
      const account = await this.prismaService.account.findFirst({
        where: { id: accountId, userId },
      });
      return account;
    } catch (error: unknown) {
      handlePrismaError(error);
      console.error(error);
      throw error;
    }
  }
}
