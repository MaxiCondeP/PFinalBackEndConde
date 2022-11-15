import dotenv from 'dotenv';
import mongoose from 'mongoose';
import admin from 'firebase-admin'
import serviceAccount from './firebase/ecommerce-db-d9fbd-firebase-adminsdk-iwnjz-fb317452e3.js'
import { logger } from "./logger_config.js"

dotenv.config();


//prueba de conexion firebase
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  logger.log("info", "Connected ok to Firebase");
} catch (error) {
  console.log(error);
}

//prueba de conexion mongo
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  logger.log("info",'Connected ok to mongoDB');
});


export const config = {
  mongo: {
    uri: process.env.MONGO_URI_STRING,
    options: { useNewUrlParser: true, useUnifiedTopology: true }
  },
  firebase: {
    db: admin.firestore()
  },
  admin_data:{
    admin_email: process.env.ADMIN_EMAIL,
    admin_pass_email: process.env.ADMIN_PASS_EMAIL,
    admin_phone: process.env.ADMIN_PHONE,
    admin_accountSid: process.env.PHONE_ACCOUNT_SID,
    admin_authToken: process.env.PHONE_AUTH_TOKEN,
  }
  
}



