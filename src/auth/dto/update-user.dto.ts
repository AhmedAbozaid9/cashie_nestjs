import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'Jane Doe',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  name: string;

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
}
