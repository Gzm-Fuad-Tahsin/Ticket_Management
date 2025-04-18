import { ObjectId } from "mongoose"

export interface IBusService{
    bus_id: ObjectId,
    date: Date,
    departure_time: string,
    arrival_time: string,
    price: number,
    total_seats: string[],
    available_seats: string[],
    ride_completed: boolean,

} 