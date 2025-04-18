import { ObjectId } from "mongoose";


export interface ITicket{
    bus_id: ObjectId,
    service_id: ObjectId,
    user_id: ObjectId,
    book_at: Date,
    seat_number: string,
    price: number,
} 