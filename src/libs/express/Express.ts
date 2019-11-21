import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import Log from "../utils/Log";

import v1Router from "./api/v1";

export default class Express {
  
  /**
   * Setup and configure Express server
   */
  static connect() {
    let app = express();
    app.use(cors());
    app.use(cookieParser())
    app.options("*", cors());
      
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
      extended: true
    }));

    // Redirect HOSTNAME:PORT/ to default API version
    app.get("/", (_, res) => {
      res.redirect(`/api/${process.env.EXPRESS_API_VERSION}`);
    });

    // Expose all endpoints of the router with a specified prefix
    app.use("/api/v1", v1Router);

    try {
      app.listen(process.env.EXPRESS_PORT);
      Log.info(`Setting up API on port ${process.env.EXPRESS_PORT}`);
    } catch (error) {
      Log.error(error.message);
    }
  }
}