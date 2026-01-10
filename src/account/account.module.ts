import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [AccountController],
  imports: [PrismaModule],
})
export class AccountModule {}
