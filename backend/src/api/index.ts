import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from '..//app.module';

const server = express();
let ready: Promise<any> | null = null;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.setGlobalPrefix('api');
  app.enableCors({ origin: process.env.FRONTEND_URL, credentials: true });
  await app.init();
  return server;
}

export default async (req: any, res: any) => {
  if (!ready) ready = bootstrap();
  await ready;
  server(req, res);
};