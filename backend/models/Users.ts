import { Document, Schema, model } from "mongoose";

export interface IUser extends Document {
  phoneNumber: string;
  fullName: string;
  image: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  phoneNumber: { type: String, required: true, unique: true },
  fullName: { type: String, default: "New User" },
  image: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export default model<IUser>("User", userSchema);
