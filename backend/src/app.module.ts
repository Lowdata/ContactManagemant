import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ContactsSchema } from './streamdata.model';
import { AppService } from './app.service';
import {MongooseModule} from "@nestjs/mongoose";
import {ConfigModule} from '@nestjs/config'
import {CacheModule} from '@nestjs/cache-manager';
import { DataController } from './data/data.controller';
import { NestFactory } from '@nestjs/core';


@Module({
  imports: [
    // .env config
    ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal:true
  }),
  // Mongo for Injection
  MongooseModule.forRoot('mongodb+srv://ayush:Ayush1234@contact.pqqoqmt.mongodb.net/contact-app')
,MongooseModule.forFeature([{ name: 'Contact', schema: ContactsSchema }]),
//cache manager
CacheModule.register({
    ttl:5000})
],
  controllers: [AppController, DataController],
  providers: [AppService],
})
export class AppModule {}
