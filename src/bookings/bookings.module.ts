import { Module } from '@nestjs/common';
import { HallsModule } from '../halls/halls.module.js';
import { ShowingsModule } from '../showings/showings.module.js';
import { BookingsController } from './bookings.controller.js';
import { BookingsService } from './bookings.service.js';

@Module({
  imports: [ShowingsModule, HallsModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
