import { Router } from 'express';
import passport from "passport";
import { isAdmin } from '../utils/middlewares.js';
import { getInfo, redirectToInfo } from '../controllers/extraApisController.js'
import {
  userSignup,
  userLogin,
  checkLogin,
  userLogout,
  loginFail,
  signupFail,
  badRoute,
  userToAdmin
} from '../controllers/usrController.js'

export const routerIndex = Router();
export const routerInfo = Router();

routerIndex.get('/', checkLogin);
routerIndex.post("/signup",
  passport.authenticate("signup", { failureRedirect: "/failSignup", }), userSignup);
routerIndex.post('/login',
  passport.authenticate("login", { failureRedirect: "/failLogin", }), userLogin);
routerIndex.get("/login", checkLogin);
routerIndex.get("/logout", userLogout);
routerIndex.get("/failLogin", loginFail)
routerIndex.get("/failSignup", signupFail);
routerIndex.post("/userToAdmin/:id", isAdmin, userToAdmin);
routerInfo.get('/info', redirectToInfo);
//Endpoint que voy a llamar desde el front a través de fetch
routerInfo.get('/info/api', getInfo);
routerInfo.get("*", badRoute);