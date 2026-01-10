import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { UserWithoutPassword } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Public()
  @Post('signin')
  async signin(@Body() dto: SigninDto) {
    return this.authService.signin(dto);
  }

  @Get('me')
  getCurrentUser(@GetUser() user: UserWithoutPassword): UserWithoutPassword {
    return this.authService.getCurrentUser(user);
  }

  @Put('me')
  updateCurrentUser(
    @GetUser('id') userId: number,
    @Body() dto: Partial<SignupDto>,
  ): Promise<UserWithoutPassword> {
    return this.authService.updateCurrentUser(userId, dto);
  }
}
