import express from "express";
import { validationResult } from "express-validator";

import Session from "../../mongo/models/Session";
import User from "../../mongo/models/User";

import ExpressValidator from "../Validator";
import Log from "../../utils/Log";
import Random from "../../utils/Random";
import bcrypt from "bcrypt";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("200 OK");
});

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
      res.json({key: session.key});
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

router.post("/user/session", async (req, res) => {
  try {
    if(req.body.key) {
      const session = await Session.findOne({key: req.body.key});
      if(session && session.active && (req.headers["x-forwarded-for"] || req.connection.remoteAddress) === session.ip_address) {
        res.json("OK");
        session.last_activity = new Date(Date.now());
        session.save();
        return;
      }
      else {
        throw Error("No valid session in database");
      }
    }
    else {
      throw Error("Session not in request");
    }
  } catch (error) {
    Log.error(`Invalid user session: ${error.message}`);
    return res.json({error: {msg: "Invalid user session"}});
  }
});

router.post("/user/logout", async (req, res) => {
  if(req.body.key) {
    try {
      const session = await Session.findOne({key: req.body.key});
      if(session && session.active && (req.headers["x-forwarded-for"] || req.connection.remoteAddress) === session.ip_address) {
        res.json("OK");
        session.active = false;
        session.last_activity = new Date(Date.now());
        session.save();
      }  
    } catch (error) {
      res.json("OK");
    }  
  }
});

export default router;