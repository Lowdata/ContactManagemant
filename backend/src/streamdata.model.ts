

import * as mongoose from 'mongoose';

export const ContactsSchema = new mongoose.Schema({
    index: {type:Number, required:true},
    name : {type:String,required: true},
    email: {type:String,required: true},
    createdAt: { type: Date, default: Date.now, required: true },
});

export interface Contacts{
    index: string,
    name: string,
    email: string,
    createdAt: Date
}