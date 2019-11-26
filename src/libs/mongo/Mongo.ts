import Log from "../utils/Log";
import mongoose from "mongoose";

export default class Mongo {

  /**
	 * Connect to MongoDB database for data storage
	 * @param uri MongoDB URI
	 */
  static async connect(uri: string = process.env.MONGO_URL as string) {
    try {
      Log.info("Connecting to database");
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      });
      Log.info("Connected to database");
    } catch (error) {
      Log.error(error.message);
      process.exit();
    }
  }

}