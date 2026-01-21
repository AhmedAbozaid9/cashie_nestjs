import { PartialType } from '@nestjs/swagger';
import { IsNumber, IsPositive, MinLength } from 'class-validator';

export class AccountDto {
  @MinLength(3)
  readonly name: string;
  @IsNumber()
  @IsPositive()
  readonly amount: number;
}

export class UpdateAccountDto extends PartialType(AccountDto) {}
