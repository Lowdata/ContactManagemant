import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as cors from 'cors'; // Import the 'cors' package

async function bootstrap() {
  dotenv.config();  
  const app = await NestFactory.create(AppModule);

  // Enable CORS for your front-end application's origin
  app.use(cors({
    origin: 'http://localhost:2000', // Replace with your front-end application's origin
  }));

  app.use(express.json());

  await app.listen(7000);
}

bootstrap();