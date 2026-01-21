import { IsNumber, IsPositive, MinLength } from 'class-validator';

export class CreateAccountDto {
  @MinLength(3)
  readonly name: string;
  @IsNumber()
  @IsPositive()
  readonly amount: number;
}
