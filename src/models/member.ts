// src/models/member.ts
import mongoose, { Schema, model, models } from "mongoose";

const memberSchema = new Schema({
  serialNumber: { type: Number, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String },
  gender: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  emergencyContact: { type: String },
  duration: { type: Number, required: true },
  paymentMode: { type: String, required: true },
  utr: { type: String },
  receiverName: { type: String },
  verified: { type: Boolean, default: false },
  amount: { type: String, required: true },
  DOJ: { type: Date, required: true },
});

const Member = models.Member || model("Member", memberSchema);
export default Member;
