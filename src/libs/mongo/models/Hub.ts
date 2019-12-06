import mongoose from "mongoose";
import { IDiscoveryInfo } from "../../../types";

export interface IHub {
  mac_address: string
  ha_connected: boolean
  discovery_info: IDiscoveryInfo
  last_ping: Date
  created_at: Date
}

export interface IHubModel extends IHub, mongoose.Document { }

const HubSchema = new mongoose.Schema<IHubModel>({
  mac_address: {type: String, unique: true, required: true},
  ha_connected: {type: Boolean, required: true, default: false},
  discovery_info: {type: Object, required: true, default: {}},
  last_ping: {type: Date, required: true},
  created_at: {type: Date, required: true, default: Date.now()}
});

const Hub: mongoose.Model<IHubModel> = mongoose.model<IHubModel>("Hub", HubSchema);
export default Hub;