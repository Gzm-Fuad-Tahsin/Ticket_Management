import { z } from "zod";


const createBusValidationSchema = z.object({
    body: z.object({
        name: z.string({ required_error: 'Name is required' }),
        bus_number: z.string({ required_error: 'Bus Number is required' }),
        source: z.string({ required_error: 'Source is required' }),
        destination: z.string({ required_error: 'Destination is required' }),
    }),
});

const updateBusValidationSchema = z.object({
    body: z.object({
        name: z.string({ required_error: 'Name is required' }).optional(),
        bus_number: z.string({ required_error: 'Bus Number is required' }).optional(),
        source: z.string({ required_error: 'Source is required' }).optional(),
        destination: z.string({ required_error: 'Destination is required' }).optional(),

    })
})

export const createBusServiceValidationSchema = z.object({
    body: z.object({
        bus_id: z.string({ required_error: 'Bus ID is required' }),
        date: z.coerce.date({ required_error: 'Date is required' }),//use z.coerce.date() if it's an actual Date
        arrival_time: z.string({ required_error: 'Arrival time is required' }),
        departure_time: z.string({ required_error: 'Departure time is required' }),
        available_seats: z.array(z.string(), { required_error: 'Available seats are required' }),
        price: z.number({ required_error: 'Price is required' }),
        total_seats: z.array(z.string(), { required_error: 'Total seats are required' }),
    })
});

export const AdminValidation = {
    updateBusValidationSchema,
    createBusValidationSchema,
    createBusServiceValidationSchema
};