import dotenv from 'dotenv';
import mongoose from 'mongoose';
import admin from 'firebase-admin'
import { logger } from "./logger_config.js"


dotenv.config();
const serviceAccount = {
  "type": "service_account",
  "project_id": process.env.FB_PROYECT_ID,
  "private_key_id": process.env.FB_PRIVATE_KEY_ID,
  "private_key": process.env.FB_PRIVATE_KEY,
  "client_email": process.env.FB_CLIENT_EMAIL,
  "client_id": process.env.FB_CLIENT_ID,
  "auth_uri": process.env.FB_AUTH_URI,
  "token_uri": process.env.FB_TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.FB_AUTH_PROVIDER_X509_CERT_URL,
  "client_x509_cert_url": process.env.FB_CLIENT_X509_CERT_URL
};


let dbfirebase = "";
let dbmongo = "";
let NODE_ENV = process.env.NODE_ENV || 'development';
let DATA_PERSISTENCE;

if (NODE_ENV == 'development') {
  DATA_PERSISTENCE = process.env.DEV_PERSISTENCE || 'FILE'
} else if (NODE_ENV == 'production') {
  DATA_PERSISTENCE = process.env.PROD_PERSISTENCE || 'MONGO'
}

if (DATA_PERSISTENCE == "FIREBASE") {
  try {
    //prueba de conexion firebase
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    dbfirebase = admin.firestore();
    logger.log("info", "Connected ok to Firebase");
  } catch (error) {
    logger.log("error", `${err}`);
  }
} else if (DATA_PERSISTENCE == "MONGO") {
  //prueba de conexion mongo
  dbmongo = mongoose.connection;
  dbmongo.on('error', console.error.bind(console, 'connection error:'));
  dbmongo.once('open', () => {
    logger.log("info", 'Connected ok to mongoDB');
  });

}


export const config = {
  mongo: {
    uri: process.env.MONGO_URI_STRING,
    options: { useNewUrlParser: true, useUnifiedTopology: true }
  },
  firebase: {
    db: dbfirebase
  },
  admin_data: {
    admin_email: process.env.ADMIN_EMAIL,
    admin_pass_email: process.env.ADMIN_PASS_EMAIL,
    admin_phone: process.env.ADMIN_PHONE,
    admin_accountSid: process.env.PHONE_ACCOUNT_SID,
    admin_authToken: process.env.PHONE_AUTH_TOKEN,
  },
  PORT: process.env.PORT || 8080,
  PERSISTENCE: DATA_PERSISTENCE,
  SESSION_TIME: process.env.SESSION_TIME || 600,
  SECRET_KEY: process.env.SECRET_KEY,
  TOKEN_TIME: process.env.TOKEN_TIME || "30m"

}



