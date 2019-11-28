import express from "express";
import { validationResult } from "express-validator";

import Session from "../../../mongo/models/Session";
import User from "../../../mongo/models/User";
import Middleware from "../../middleware/Middleware";

import ExpressValidator from "../../Validator";
import Log from "../../../utils/Log";
import Random from "../../../utils/Random";
import bcrypt from "bcrypt";


const router = express.Router();

router.post("/user/login", ExpressValidator.UserLoginRoute, async (req:express.Request, res:express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ error: errors.array() });
  }

  try {
    const user = await User.findOne({
      username: req.body.username
    });
  
    if(user && await bcrypt.compare(req.body.password, user.password_hash)) {
      const session = new Session({
        key: Random.string(),
        user: user._id,
        ip_address: req.headers["x-forwarded-for"] || req.connection.remoteAddress
      });

      await session.save();
      return res.json({key: session.key});
    }
    else {
      return res.json({
        error: [{
          "msg": "Combinatie van gebruikersnaam en wachtwoord is onjuist."
        }]
      });
    }

  } catch (error) {
    Log.error(`Mongo /user/login ${error.message}`);
    return res.status(500).send();
  }
});

router.post("/user/session", Middleware.Portal.isValidSession, (req, res) => {
  try {
    if(res.locals.session) {
      res.locals.session.last_activity = new Date(Date.now());
      res.locals.session.save();
      return res.json("OK");
    }
  }
  catch (error) {
    Log.error(`Issue updating session: ${error.message}`);
    return res.json({error: {msg: "Ongeldige gebruikerssessie"}});
  }
});

router.post("/user/logout", Middleware.Portal.isValidSession, (req, res) => {
  try {
    if(res.locals.session) {
      res.locals.active = false;
      res.locals.last_activity = new Date(Date.now());
      res.locals.save();
      return res.json("OK");
    }  
  }
  catch (error) {
    Log.error(`Issue loggin out: ${error.message}`);
    return res.json("OK");
  }  
});

export default router;