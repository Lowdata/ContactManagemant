import { Inject, Injectable } from '@nestjs/common';
import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/common-evm-utils';
import * as dotenv from 'dotenv';
import { ContactsSchema, Contacts } from './streamdata.model';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Model } from 'mongoose';
import {ethers} from 'ethers';
import Redis from 'ioredis';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Info } from './contractData';


@Injectable()
export class AppService {
    
  constructor(@InjectModel('Contact') private contactModel: Model<Contacts>, @Inject (CACHE_MANAGER) private readonly cacheManager:Cache) {
    dotenv.config();

    Moralis.start({
      apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjJlY2E5YWE5LTA0MDAtNDgxMC1iZTkwLTlkN2FkYjc3MWZkZCIsIm9yZ0lkIjoiMzU5Nzc1IiwidXNlcklkIjoiMzY5NzQ5IiwidHlwZUlkIjoiMzUwODQ2NzQtYjE3ZC00MjFhLWJjZmItYTM2YzQ5MDA1MDI3IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2OTY0MTIyMTgsImV4cCI6NDg1MjE3MjIxOH0.KtVLmYozrHLTstKseYEA8jNlDWFRSpj8Qz88NrOkn6Y',
    });
    
    
    
    this.setupStreams(); //Moralis stream creation 
    this.dbConnection(); //MongoDB CONNECTION
    this.startup(); // Fetch all the data stored in the DB 
   
    
    
  }
  private async dbConnection() {
    try {
      await mongoose.connect('mongodb+srv://ayush:Ayush1234@contact.pqqoqmt.mongodb.net/contact-app');
  
      console.log('Connected to the MongoDB database');
    } catch (error) {
      console.error('Error establishing DB connection:', error);
    }
  }

  async setupStreams() {
    const options = {
      chains: [EvmChain.GOERLI, EvmChain.ETHEREUM],
      description: 'Listen to Contract streams on Goerli',
      tag: 'Contract',
      includeContractLogs: true,
      includeNativeTxs: true,
      includeInternalTxs: true,
      webhookUrl: 'https://9464-103-60-196-127.ngrok-free.app/webhook',
    };

    const newStream = await Moralis.Streams.add(options);
    const { id } = newStream.toJSON();
    
    const ContractAddress = Info.contractAddress;
    await Moralis.Streams.addAddress({ address: ContractAddress, id });

    console.log('Stream Created');
  }

  // index tracker 
private async getHighestIndex() {
    try {
      const latestContact = await this.contactModel
        .findOne()
        .sort({ index: -1 }) 
        .exec();

      if (latestContact) {
        const highestIndex = latestContact.index;
        return highestIndex;
      } else {
        console.log('No data in the database yet.');
        return null;
      }
    } catch (error) {
      console.error('Error getting the highest index:', error);
      return null;
    }
  }

  //fetch data from the db at startUp
  async startup() {
    try {
      const allContacts = await this.contactModel.find().exec();
      await this.getHighestIndex();
      return allContacts;
    } catch (error) {
      console.error('Error during fetching Data here is the data present:', error);

    }
  }

  // add data to the db as any stream is detected
  async addEventDataToDatabase(data: Contacts[]) {
    try {

      const newContact = new this.contactModel(data);
      await newContact.save();
      

    } catch (error) {
      console.error('Error adding data to the database:', error);
    }
  }

  //uses index marker and the array length to identify the data to be added
  async addLatestContactsToDatabase() {
    const highestIndex = await this.getHighestIndex();
    console.log("highest:" ,highestIndex)
    const contactData = [];

    let length = await this.getContactCounts();
    for (let i:any = highestIndex + 1; i < length; i++) {
        const contact = await this.readData(i);
        if (contact && contact.name && contact.email) {
            const newContact = new this.contactModel({
                "index": i,
                "name": contact.name, 
                "email": contact.email,
                "createdAt": new Date(),
            });
            contactData.push(newContact);
            
        }
    }  
    if (contactData.length > 0) {
        await this.contactModel.insertMany(contactData); 
        return contactData; 
      } else {
        return []; 
      } 
}

async getLatestContactsFromCache(){
    const cacheKey = 'latestContacts';

    // Attempt to retrieve data from cache
    const cachedData = await this.cacheManager.get<Contacts[]>(cacheKey);

    if (cachedData) {
      console.log('Data retrieved from cache');
      return cachedData;
    } else {
      console.log('Data not found in cache; fetching from source');
      const latestContacts = await this.startup();
      if(latestContacts){await this.cacheManager.set(cacheKey, latestContacts, 5000); 
    return latestContacts;
    }

      return latestContacts;
    }
  }
  

    //CONTRACT interaction
    // contact tracker from the contract
  async getContactCounts(): Promise<any>{
    let contractABI = Info.contractABI
    const provider = new ethers.JsonRpcProvider('https://goerli.infura.io/v3/caa3728ae2354c36a311c17adf5550a5');
    const contract = new ethers.Contract(Info.contractAddress, contractABI, provider);
    try {
        const contact = await contract.getContactCount();
        console.log('Contact:', contact);
        return contact;
    } catch (error) {
        console.error('Error fetching contact:', error);
        return 0;
    }
  }

  // reads and returns the data stored in the contract 
  async readData(contactId:number):Promise<Contacts>{
    let contractABI = Info.contractABI
    const provider = new ethers.JsonRpcProvider('https://goerli.infura.io/v3/caa3728ae2354c36a311c17adf5550a5');
    const contract = new ethers.Contract(Info.contractAddress, contractABI, provider);
    try {
        const contact = await contract.getContact(contactId);
        console.log('Contact:', contact);
        return contact;
    } catch (error) {
        console.error('Error fetching contact:', error);
    }
  }
}