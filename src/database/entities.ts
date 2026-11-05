import { BookingSeat } from '../bookings/entities/booking-seat.entity.js';
import { Booking } from '../bookings/entities/booking.entity.js';
import { Film } from '../films/entities/film.entity.js';
import { Hall } from '../halls/entities/hall.entity.js';
import { Showing } from '../showings/entities/showing.entity.js';

export const entities = [Film, Hall, Showing, Booking, BookingSeat];
