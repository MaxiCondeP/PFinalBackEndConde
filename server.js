import { routerCart } from './src/routes/routesCart.js';
import { routerProd } from './src/routes/routesProduct.js';
import { routerOrder } from './src/routes/routesOrders.js';
import { routerMessage } from './src/routes/routesMessages.js';
import { routerIndex, routerInfo } from './src/routes/routes.js';
import session from 'express-session';
import passport from "passport";
import { Strategy } from "passport-local";
import MongoStore from "connect-mongo";
import path from "path";
import { fileURLToPath } from 'url';
import { Server as HTTPServer } from "http";
import express from 'express';
import { config } from './config.js'
import cluster from "cluster";
import os from "os";
import parseArgs from "minimist";
import { logger } from "./logger_config.js"
import fileUpload from 'express-fileupload';
import { localPassport } from "./src/utils/passport.js";


const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
const options = { default: { MODE: "fork" }, alias: { m: "MODE" } }
const args = parseArgs(process.argv.slice(2), options);


import repositoryCarts from "./src/modules/repositoryCarts.js";
import repositoryProducts from "./src/modules/repositoryProducts.js";
import repositoryUsr from "./src/modules/repositoryUsr.js";
import repositoryMessages from "./src/modules/repositoryMessages.js";
import repositoryOrders from "./src/modules/repositoryOrders.js";
const repoCarts = new repositoryCarts();
const repoProducts = new repositoryProducts();
const repoUsr = new repositoryUsr();
const repoMessages = new repositoryMessages();
const repoOrders = new repositoryOrders();
export const daoProducts = await repoProducts.getDao();
export const daoCarts = await repoCarts.getDao();
export const daoUsr = await repoUsr.getDao();
export const daoMessages = await repoMessages.getDao();
export const daoOrders = await repoOrders.getDao();


const app = express();
export const httpServer = new HTTPServer(app);

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(session({
  store: new MongoStore({
    mongoUrl: 'mongodb+srv://root:pwd123@cluster0.age0did.mongodb.net/ecommerce-atlas?retryWrites=true&w=majority',
    dbName: "ecommerce-atlas",
    collectionName: "sessions",
    ttl: config.SESSION_TIME,//Seteo el tiempo de sesión en 10min
    retries: 0
  }),
  secret: 'STRING_SECRET',
  resave: false,
  saveUninitialized: true,
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(fileUpload());
const LocalStrategy = Strategy;
await localPassport(passport, LocalStrategy);

app.use('/', routerIndex);
app.use('/', routerInfo);
app.use('/api/products', routerProd);
app.use('/api/cart', routerCart);
app.use('/api/orders', routerOrder);
app.use('/api/chat', routerMessage);


const srv = httpServer;
const PORT = config.PORT;



if (args.MODE === 'CLUSTER') {

  if (cluster.isMaster) {
    const numCPUs = os.cpus().length;
    logger.log("info", `numCPUs: ${numCPUs}`);
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
    cluster.on("exit", () => {
      logger.log("info", `Worker died ${process.pid}`);
    })
  } else {

    srv.on("request", (req, res) => {
      const pid = process.pid;
      const fecha = new Date(Date.now());

    });

    try {
      srv.listen(PORT, () => {
        logger.log("info", `Servidor escuchando en el puerto ${PORT}. PID: ${process.pid}`);
      });
    } catch (err) {
      logger.log("error", `Error en el servidor: ${err}`);
    }
  }
} else {
  try {
    srv.listen(PORT, () => {
      logger.log("info", `Servidor escuchando en el puerto ${PORT}. PID: ${process.pid}`);
    });
    srv.on("error", (error) => logger.log("error", `Error en el servidor: ${erorr}`));
  } catch (err) {
    logger.log("error", `Error en el servidor: ${err}`);
  }
}