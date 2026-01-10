import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';
import { Match } from '../../common/decorators/match.decorator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Password for the account (minimum 8 characters)',
    example: 'correcthorsebatterystaple',
    minLength: 8,
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @MinLength(8)
  current_password: string;

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

  @ApiProperty({
    description: 'Confirm your password',
    example: 'correcthorsebatterystaple',
    minLength: 8,
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @MinLength(8)
  @Match('password', { message: 'Passwords do not match' })
  password_confirmation: string;
}
