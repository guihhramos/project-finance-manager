import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // 1. Configuração para servir o React
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), '..', 'frontend', 'dist'),
      exclude: ['/api*'], // Protege as rotas do backend
    }),
    
    // 2. Os teus módulos do AutoPrime Motors / Finance Manager
    PrismaModule,
    AuthModule,
    CategoriesModule,
    TransactionsModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}