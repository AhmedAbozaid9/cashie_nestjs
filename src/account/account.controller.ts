import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@Controller('account')
@UseGuards(JwtAuthGuard)
export class AccountController {
  @Get()
  getAccountInfo(@GetUser() userId: number) {
    return { userId };
  }
}
