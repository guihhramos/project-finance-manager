import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { beforeEach, describe, it } from 'node:test';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });
  
});
function expect(service: PrismaService) {
  throw new Error('Function not implemented.');
}

