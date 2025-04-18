import { ObjectId } from "mongoose";

export interface IBus {
    name: string;
    route: string;
    bus_number: string;
    source : string;
    destination : string;
  }

