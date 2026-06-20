import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionType } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) { }

  async create(userId: string, createTransactionDto: CreateTransactionDto) {
    return this.prisma.transaction.create({
      data: {
        title: createTransactionDto.title,
        amount: createTransactionDto.amount,
        type: createTransactionDto.type,
        date: new Date(createTransactionDto.date), // Transforma a string num Date
        categoryId: createTransactionDto.categoryId,
        userId: userId, // Injeta o ID do utilizador logado
      },
    });
  }

  // O TEU CÉREBRO FINANCEIRO VOLTOU!
  async getDashboard(userId: string) {
    const transactions = await this.prisma.transaction.findMany({
      where: { userId },
    });

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === 'INCOME') {
        totalIncome += transaction.amount;
      } else if (transaction.type === 'EXPENSE') {
        totalExpense += transaction.amount;
      }
    });

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }

  async findAll(userId: string, filters: { page?: number; limit?: number; type?: string; categoryId?: string }) {
    const page = filters.page || 1;
    const limit = filters.limit || 10;

    return this.prisma.transaction.findMany({
      where: {
        userId,
        type: filters.type ? (filters.type as TransactionType) : undefined,
        categoryId: filters.categoryId ? filters.categoryId : undefined,
      },
      include: { // <--- ESTA É A CHAVE DO MISTÉRIO
        category: true
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    // Busca a transação exigindo o ID e o Dono (userId)
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada ou não autorizada');
    }
    return transaction;
  }

  async update(id: string, userId: string, updateTransactionDto: UpdateTransactionDto) {
    // 1. Verifica se a transação existe e pertence a este utilizador
    await this.findOne(id, userId);

    // 2. Se a validação passar, atualiza
    return this.prisma.transaction.update({
      where: { id },
      data: {
        ...updateTransactionDto,
        // Se a data for enviada na atualização, converte de volta para Date
        date: updateTransactionDto.date ? new Date(updateTransactionDto.date) : undefined,
      },
    });
  }

  async remove(id: string, userId: string) {
    // 1. Verifica se a transação existe e pertence a este utilizador.
    await this.findOne(id, userId);

    // 2. Apaga com segurança
    return this.prisma.transaction.delete({
      where: { id },
    });
  }
}