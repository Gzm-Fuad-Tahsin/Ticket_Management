import mongoose, { Schema } from "mongoose";
import { ITicket } from "./ticket.interface";

const TicketSchema = new Schema<ITicket>({
  bus_id: { type: Schema.Types.ObjectId, ref: "Bus", required: true },
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  service_id: { type: Schema.Types.ObjectId, ref: "BusService", required: true },
  seat_number: { type: String, required: true },
  book_at: { type: Date, default: Date.now },
  price: { type: Number, required: true },
}, { timestamps: true });

export const Ticket = mongoose.model<ITicket>("Ticket", TicketSchema);