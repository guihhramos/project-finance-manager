import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Importa aqui!

@Module({
  imports: [PrismaModule], // Adiciona aqui!
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}