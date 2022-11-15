import { routerCart } from './routes/routesCart.js';
import { routerProd } from './routes/routesProduct.js';
import { daoUsr } from './daos/index.js'
import session from 'express-session';
import passport from "passport";
import { Strategy } from "passport-local";
import MongoStore from "connect-mongo";
import path from "path";
import { fileURLToPath } from 'url';
import { Server as HTTPServer } from "http";
import express from 'express';
import dotenv from 'dotenv';
import cluster from "cluster";
import os from "os";
import parseArgs from "minimist";
import { logger } from "./logger_config.js"
import fileUpload from 'express-fileupload';
import { getSignupMail } from './utils/mailer.js';



const LocalStrategy = Strategy;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = { default: { MODE: "fork" }, alias: { m: "MODE" } }
const args = parseArgs(process.argv.slice(2), options);
console.log(args)


const app = express();
const httpServer = new HTTPServer(app);
dotenv.config();


const PORT = process.env.LOCAL_PORT || 3000;


////PASSPORT

passport.use("login", new LocalStrategy(async (username, password, done) => {
  const user = await daoUsr.getUsr(username, password);
  if (!user) {
    return done(null, null, { message: "Invalid username or password" });
  } else {
    return done(null, user);
  }
}));

passport.use("signup", new LocalStrategy({
  passReqToCallback: true
}, async (req, username, password, done) => {
  let EDFile = req.files.avatar
  EDFile.mv(`./public/img/${EDFile.name}`, err => {
    if (err) {
      logger.log("error", `Error al cargar archivo: ${err}`);
    } else {
      logger.log("info", `File upload`);
    }
  })
  req.body.avatar = `./public/img/${EDFile.name}`;
  const user = await daoUsr.newUsr(req.body);
  if (user) {
    await getSignupMail(user);
    return done(null, user);
  } else {
    return done(null, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await daoUsr.usrById(id);
  done(null, user);
});

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(session({
  store: new MongoStore({
    mongoUrl: 'mongodb+srv://root:pwd123@cluster0.age0did.mongodb.net/ecommerce-atlas?retryWrites=true&w=majority',
    dbName: "ecommerce-atlas",
    collectionName: "sessions",
    ttl: 600,//Seteo el tiempo de sesión en 10min
    retries: 0
  }),
  secret: 'STRING_SECRET',
  resave: false,
  saveUninitialized: true,
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(fileUpload());
app.use('/api/products', routerProd);
app.use('/api/cart', routerCart);


app.get('/', (req, res, next) => {
  res.redirect("/login");
  logger.log("info", `Ruta: ${req.url}, Metodo: ${req.method}`);
});

app.post("/signup", passport.authenticate("signup",
  {
    failureRedirect: "/failSignup",
  }), (req, res) => {
    req.session.user = req.user;
    logger.log("info", `Ruta: ${req.url}, Metodo: ${req.method}`);
    res.redirect("/login");
  });


app.post('/login', passport.authenticate("login", {
  failureRedirect: "/failLogin",
}), (req, res) => {
  req.session.user = req.user;
  logger.log("info", `Ruta: ${req.url}, Metodo: ${req.method}`);
  res.send("LOGGED OK!");
});


app.get("/login", (req, res) => {
  //Si esta autenticado va a directo a dashboard
  if (!req.session.user) {
    res.sendFile(__dirname + "/public/login.html");
  } else {
    logger.log("info", `Ruta: ${req.url}, Metodo: ${req.method}`);
    res.send("LOGGED OK");
  }
})

app.get("/signup", (req, res) => {
  logger.log("info", `Ruta: ${req.url}, Metodo: ${req.method}`);
  res.sendFile(__dirname + "/public/signup.html");
});

app.get("/failLogin", (req, res) => {
  logger.log("info", `Ruta: ${req.url}, Metodo: ${req.method}`);
  res.sendFile(__dirname + "/public/failLogin.html");
});

app.get("/failSignup", (req, res) => {
  logger.log("info", `Ruta: ${req.url}, Metodo: ${req.method}`);
  res.sendFile(__dirname + "/public/failSignup.html");
});

app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      logger.log("error", `Error al cerrar sesion: ${err}`);
    }
    logger.log("info", `Ruta: ${req.url}, Metodo: ${req.method}`);
    res.redirect("/login")
  });
});


const srv = httpServer;

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