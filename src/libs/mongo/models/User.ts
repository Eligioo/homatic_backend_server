import mongoose from "mongoose";

export interface IUser {
	username: string
  password_hash: string
  is_admin: boolean
	created_at: Date
}

interface IUserModel extends IUser, mongoose.Document { }

const UserSchema = new mongoose.Schema<IUserModel>({
  username: {type: String, unique: true, required: true},
  password_hash: {type: String, required: true},
  is_admin: {type: Boolean, required: true, default: false},
  created_at: {type: Date, required: true, default: Date.now()}
});

const User: mongoose.Model<IUserModel> = mongoose.model<IUserModel>("User", UserSchema);
export default User;