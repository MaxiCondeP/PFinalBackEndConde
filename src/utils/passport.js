import { daoUsr } from"../../server.js"
import { logger } from "../../logger_config.js"
import fileUpload from 'express-fileupload';
import { getSignupMail } from '../utils/mailer.js';
import { __dirname } from "../../server.js";



export const localPassport = async (passport, LocalStrategy) => {
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

}
