import mongoose from "mongoose";

export interface ISession {
	active: boolean
	key: String
	user: mongoose.Types.ObjectId
	last_activity: Date
	ip_address: string
	created_at: Date
}

interface ISessionModel extends ISession, mongoose.Document { }

const SessionSchema = new mongoose.Schema<ISessionModel>({
  active: {type: Boolean, default: true, required: true},
  key: {type: String, unique: true, required: true},
  user: {type: mongoose.Types.ObjectId, unique: false, required: true},
  last_activity: {type: Date, required: true, default: Date.now()},
  ip_address: {type: String, required: true},
  created_at: {type: Date, required: true, default: Date.now()}
});

const Session: mongoose.Model<ISessionModel> = mongoose.model<ISessionModel>("Session", SessionSchema);
export default Session;