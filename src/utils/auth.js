import { daoUsr } from "../../server.js"
import { logger } from "../../logger_config.js"
import fileUpload from 'express-fileupload';
import { getSignupMail } from '../utils/mailer.js';
import { __dirname } from "../../server.js";
import { config } from "../../config.js"
import passport from "passport";
import { Strategy as JWTStrategy } from 'passport-jwt';
import { ExtractJwt as ExtractJWT } from 'passport-jwt';
import { Strategy } from "passport-local";
import jwt from 'jsonwebtoken';


const LocalStrategy = Strategy;


export const authJWT = passport.authenticate("jwt", { session: false }); 

export const signToken = (user) => {
    const token = jwt.sign(
        {
            data: {
                user: user
            }
        },
        config.SECRET_KEY,
        { expiresIn: config.TOKEN_TIME }

    );
    return token;
}

export const localPassport = async (passport) => {
    passport.use("login", new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, async (username, password, done) => {
        try {
            const user = await daoUsr.getUsr(username, password);
            if (!user) {
                return done(null, null, { message: "Invalid username or password" });
            } else {
                return done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }));

    passport.use("signup", new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'username',
        passwordField: 'password'
    }, async (req, username, password, done) => {
        const user = await daoUsr.newUsr(req.body);
        console.log(user);
        if (user) {
           // await getSignupMail(user);
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

    passport.use(new JWTStrategy({
        secretOrKey: config.SECRET_KEY,
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    }, async (payload, done) => {
        try {
            const user = payload;
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }))


}
