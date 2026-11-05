import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Seat } from '../halls/entities/hall.entity.js';
import { HallsService } from '../halls/halls.service.js';
import { ShowingsService } from '../showings/showings.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { Booking, ShowingSeat } from './entities/booking.entity.js';

const seatKey = ({ row, seat }: Seat) => `${row}:${seat}`;
const seatLabel = ({ row, seat }: Seat) => `row ${row} seat ${seat}`;

@Injectable()
export class BookingsService {
  private readonly bookings: Booking[] = [];

  constructor(
    private readonly showingsService: ShowingsService,
    private readonly hallsService: HallsService,
  ) {}

  create(showingId: string, dto: CreateBookingDto): Booking {
    const showing = this.showingsService.findById(showingId);
    const hall = this.hallsService.findOne(showing.hallId);
    const seats = dto.seats.map(({ row, seat }) => ({ row, seat }));

    const outsideHall = seats.filter(
      (seat) => !this.hallsService.hasSeat(hall, seat),
    );
    if (outsideHall.length > 0) {
      throw new BadRequestException(
        `Hall "${hall.name}" has no ${outsideHall.map(seatLabel).join(', ')}`,
      );
    }

    const booked = this.findBookedSeatKeys(showingId);
    const taken = seats.filter((seat) => booked.has(seatKey(seat)));
    if (taken.length > 0) {
      throw new ConflictException(
        `Already booked: ${taken.map(seatLabel).join(', ')}`,
      );
    }

    const booking: Booking = {
      id: randomUUID(),
      showingId,
      seats,
      totalPrice: showing.price * seats.length,
    };
    this.bookings.push(booking);
    return booking;
  }

  findAll(): Booking[] {
    return this.bookings;
  }

  findByShowing(showingId: string): Booking[] {
    this.showingsService.findById(showingId);
    return this.bookings.filter((booking) => booking.showingId === showingId);
  }

  findSeats(showingId: string): ShowingSeat[] {
    const showing = this.showingsService.findById(showingId);
    const hall = this.hallsService.findOne(showing.hallId);
    const booked = this.findBookedSeatKeys(showingId);
    return this.hallsService.listSeats(hall).map((seat) => ({
      ...seat,
      isBooked: booked.has(seatKey(seat)),
    }));
  }

  remove(id: string): void {
    const index = this.bookings.findIndex((booking) => booking.id === id);
    if (index === -1) {
      throw new NotFoundException(`Booking with id "${id}" not found`);
    }
    this.bookings.splice(index, 1);
  }

  private findBookedSeatKeys(showingId: string): Set<string> {
    return new Set(
      this.bookings
        .filter((booking) => booking.showingId === showingId)
        .flatMap((booking) => booking.seats.map(seatKey)),
    );
  }
}
