import mongoose from "mongoose";
import admin from 'firebase-admin'
import serviceAccount from '../firebase/ecommerce-db2-f8fe9-firebase-adminsdk-yarzw-3b93564996.js'
import { config } from '../../config.js'
const Schema = mongoose.Schema;


const userSchema = new Schema({
  username: { type: String },
  password: { type: String },
});

export const User = mongoose.model('users', userSchema);

export const connectUsrDB = () => {
  

  try {
    mongoose.connect(config.mongo.uri, config.mongo.options);
  } catch (error) {
    console.log("Error en db", error);
  };

};