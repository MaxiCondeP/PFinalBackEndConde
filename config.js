import dotenv from 'dotenv';
import mongoose from 'mongoose';
import admin from 'firebase-admin'
import serviceAccount from './firebase/ecommerce-db-d9fbd-firebase-adminsdk-iwnjz-fb317452e3.js'

dotenv.config();


//prueba de conexion firebase
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("Connected ok to Firebase");
} catch (error) {
  console.log(error);
}

//prueba de conexion mongo
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:')); 
db.once('open', () => {
  console.log('Connected ok to mongoDB'); 
});


export const config = {
  mongo: {
    uri: process.env.MONGO_URI_STRING,
    options: { useNewUrlParser: true, useUnifiedTopology: true }
  },
  firebase: {
    db: admin.firestore()
  }
}



