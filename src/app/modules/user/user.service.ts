import mongoose, { isValidObjectId, Types } from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { BusService } from "../admin/busServices/service.model";
import { Ticket } from "../admin/ticket/ticket.model";
import { Bus } from "../admin/bus/bus.model";
import { ITicket } from "../admin/ticket/ticket.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

export const getBus = async (
  query: Record<string, unknown> // or RequestQuery for stricter type
) => {
  // console.log(query);
  const ids = await BusService.distinct("bus_id", { availability: true });
//  console.log(ids);
  
  const queryBuilder = new QueryBuilder(
    Bus.find({ _id: { $in: ids } }),
    query
  );

  queryBuilder.filter();
  queryBuilder.search(["name", "bus_number"]);
  queryBuilder.sort();
  queryBuilder.paginate();
  queryBuilder.filed();

  const bus = await queryBuilder.modelQuery;
  const meta = await queryBuilder.countTotal();

  return { bus, meta };
};

// export const getTicket = async (
//     query: Record<string, unknown> // or RequestQuery for stricter type
//     )=> {
//         const queryBuilder = new QueryBuilder(BusService.find({ride_completed: false}), query);
//         queryBuilder.filter();
//         queryBuilder.search(["bus_id", "date","price"]);
//         queryBuilder.sort();
//         queryBuilder.paginate();
//         queryBuilder.filed();
//         const ticket = await queryBuilder.modelQuery;
//         const meta = await queryBuilder.countTotal();
//         return { ticket, meta };
//         };

const getTicket = async (query: Record<string, unknown>) => {
  const searchTerm = query.searchTerm as string | undefined;
  const objectId = query.busId as string | undefined;
  const dateString = query.date as string | undefined;

  const andConditions: any[] = [{ availability: true }];

  // // Search by name (searchTerm)
  // if (searchTerm) {
  //   andConditions.push({
  //     name: { $regex: searchTerm, $options: "i" },
  //   });
  // }

  // Search by ObjectId
  if (objectId && isValidObjectId(objectId)) {
    andConditions.push({ bus_id: objectId });
  }

  // Search by date
  if (dateString) {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      // match full date range (00:00 to 23:59)
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      andConditions.push({
        date: { $gte: start, $lte: end },
      });
    }
  }

  const filterQuery =
    andConditions.length > 1 ? { $and: andConditions } : andConditions[0];
  console.log(filterQuery);

  const tickets = await BusService.find(filterQuery);
  // console.log(tickets);

  return {
    ticket: tickets,
    meta: {
      total: tickets.length,
    },
  };
};

const PurchaseTicket = async (payload: Partial<ITicket>, user: string) => {
  let servicesData = await BusService.findOne({_id: payload.service_id,availability: true });

  if (!servicesData) {
    throw new AppError(httpStatus.BAD_REQUEST, "Service not found");
  }

  if (
    !payload.bus_id ||
    !payload.service_id ||
    !payload.seat_number ||
    !servicesData.price
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Missing required fields');
  }
  // Check if seat_number is available
if (!servicesData.available_seats.includes(payload.seat_number)) {
  throw new AppError(httpStatus.BAD_REQUEST, 'Seat is already booked or not available');
}

  const ticketData: ITicket = {
    bus_id: payload.bus_id,
    service_id: payload.service_id,
    user_id: new Types.ObjectId(user),
    book_at: new Date(),
    seat_number: payload.seat_number,
    price: servicesData.price,
  };

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Create ticket
    const ticket = await Ticket.create([ticketData], { session });
    if (!ticket.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to Purchase Ticket');
    }

    // Update BusService: remove booked seat from available_seats
    const updateResult = await BusService.findByIdAndUpdate(
      payload.service_id,
      {
        $pull: { available_seats: payload.seat_number },
      },
      { session }
    );

    if (!updateResult) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update BusService seat availability');
    }

    await session.commitTransaction();

    return {
      ticket: ticket[0],
    };
  } catch (error) {
    await session.abortTransaction();

    throw new AppError(
      httpStatus.BAD_REQUEST,
      (error as Error).message || 'An unknown error occurred',
      (error as Error)?.stack,
    );
  } finally {
    await session.endSession();
  }
};


export const UserServices = {
  getBus,
  getTicket,
  PurchaseTicket
};
