import { ObjectId, Types } from "mongoose";


export interface ITicket{
    bus_id: ObjectId,
    service_id: ObjectId,
    user_id: Types.ObjectId,
    book_at: Date,
    seat_number: string,
    price: number,
} 