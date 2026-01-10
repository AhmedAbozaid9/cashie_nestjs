import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SigninDto {
  @ApiProperty({
    description: 'User email address',
    example: 'jane@example.com',
    format: 'email',
    required: true,
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password for the account (minimum 8 characters)',
    example: 'correcthorsebatterystaple',
    minLength: 8,
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
