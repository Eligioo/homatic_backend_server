import dotenv from "dotenv";
import Express from "./libs/express/Express";
import Log from "./libs/utils/Log";
import Mongo from "./libs/mongo/Mongo";

Log.info("Starting Homatic backend server");

/**
 * Entrypoint
 */
(async () => {
  try {    
    // Load .env file
    const conf = dotenv.config();
    if (conf.error)
      throw Error('Unable to load .env file')
    else
      Log.info("Loaded .env file");
		
    await Mongo.connect();
    
    Express.connect();
		
  } catch (error) {
    Log.error(error.message);
    process.exit();
  }
})();