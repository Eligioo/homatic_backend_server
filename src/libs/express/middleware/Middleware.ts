// eslint-disable-next-line no-unused-vars
import express from "express";
import Session from "../../mongo/models/Session";
import LogUtils from "../../utils/Log";

class PortalMiddleware {
  public static async isValidSession(req:express.Request, res:express.Response, next:express.NextFunction) {
    try {
      if(!req.body.key) {
        res.json({error: {msg: "Geen key meegestuurd"}});
        throw Error("Session not in request");
      }
  
      const session = await Session.findOne({key: req.body.key});
      if(session && session.active && (req.headers["x-forwarded-for"] || req.connection.remoteAddress) === session.ip_address) {
        res.locals.session = session;
        return next();
      }
      else {
        res.json({error: {msg: "Ongeldige sessie"}});
        throw Error("No valid session in database");
      }
    } catch (error) {
      LogUtils.warn(`Invalid user session: ${error.message}`);
    }
  }
}

export default class Middleware {
  public static Portal = PortalMiddleware
}