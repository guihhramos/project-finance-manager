import { IsString, IsNumber, IsEnum, IsDateString } from 'class-validator';
import { TransactionType } from '@prisma/client'; // Importa o Enum do Prisma!

export class CreateTransactionDto {
  @IsString()
  title: string; // <-- De 'description' para 'title' para bater certo com o Prisma

  @IsNumber()
  amount: number;

  @IsEnum(TransactionType)
  type: TransactionType; // <-- Enum correto do Prisma

  @IsDateString()
  date: string;

  @IsString()
  categoryId: string;
}