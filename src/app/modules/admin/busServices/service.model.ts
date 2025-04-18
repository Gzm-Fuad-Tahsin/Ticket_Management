import mongoose, { Schema } from "mongoose";
import { IBusService } from "./service.interface";

const BusServiceSchema = new Schema<IBusService>({
  bus_id: {type: Schema.Types.ObjectId , ref: 'Bus'},
  date: {type: Date},
  arrival_time: {type: String },
  departure_time: {type: String },
  price: {type: Number },
  available_seats : {type: [String], default: [] },
  total_seats: {type: [String], default: [] },
  ride_completed: {type: Boolean, default: false },

}, { timestamps: true });

export const Bus = mongoose.model<IBusService>("BusService", BusServiceSchema);