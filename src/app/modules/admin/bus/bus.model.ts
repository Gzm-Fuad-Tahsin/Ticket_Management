import mongoose, { Schema } from "mongoose";
import { IBus } from "./bus.interface";

const BusSchema = new Schema<IBus>({
  name: { type: String, required: true },
  bus_number: { type: String, required: true },
  source : { type: String, required: true },
  destination : { type: String, required: true },
}, { timestamps: true });

export const Bus = mongoose.model<IBus>("Bus", BusSchema);