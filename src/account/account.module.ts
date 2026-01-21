import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AccountService } from './account.service';

@Module({
  controllers: [AccountController],
  imports: [PrismaModule],
  providers: [AccountService],
})
export class AccountModule {}
