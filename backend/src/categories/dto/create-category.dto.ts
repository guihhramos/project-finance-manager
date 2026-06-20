import { IsNotEmpty, IsEnum, IsString } from 'class-validator';

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType;
}