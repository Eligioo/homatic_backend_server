import mongoose from "mongoose";

import { Weather } from "../../../types";

export interface IHub {
  weather: Weather
  updated_at: Date
}

export interface IHubModel extends IHub, mongoose.Document { }

const HubSchema = new mongoose.Schema<IHubModel>({
  weather: {type: String, required: true},
  updated_at: {type: Date, required: true, default: Date.now()}
});

const Hub: mongoose.Model<IHubModel> = mongoose.model<IHubModel>("Hub", HubSchema);
export default Hub;