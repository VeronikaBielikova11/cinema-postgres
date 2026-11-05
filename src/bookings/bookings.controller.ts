import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { parseIdPipe } from '../common/parse-id.pipe.js';
import { BookingsService } from './bookings.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { BookingResponseDto, ShowingSeat } from './dto/booking-response.dto.js';

@ApiTags('bookings')
@Controller()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('bookings')
  @ApiOperation({ summary: 'Отримати всі бронювання' })
  @ApiOkResponse({ type: [BookingResponseDto], description: 'Масив бронювань' })
  findAll(): Promise<BookingResponseDto[]> {
    return this.bookingsService.findAll();
  }

  @Post('showings/:id/bookings')
  @ApiOperation({ summary: 'Забронювати місця на сеанс' })
  @ApiCreatedResponse({
    type: BookingResponseDto,
    description: 'Бронювання створено',
  })
  @ApiBadRequestResponse({
    description:
      'Масив порожній, елемент некоректний, місце повторюється або його немає в залі',
  })
  @ApiNotFoundResponse({ description: 'Сеансу з таким id немає' })
  @ApiConflictResponse({
    description:
      'Місце вже заброньоване, жодне місце зі списку не бронюється (транзакція відкочується)',
  })
  create(
    @Param('id', parseIdPipe) showingId: string,
    @Body() dto: CreateBookingDto,
  ): Promise<BookingResponseDto> {
    return this.bookingsService.create(showingId, dto);
  }

  @Get('showings/:id/bookings')
  @ApiOperation({ summary: 'Отримати бронювання сеансу' })
  @ApiOkResponse({
    type: [BookingResponseDto],
    description: 'Масив бронювань сеансу',
  })
  @ApiNotFoundResponse({ description: 'Сеансу з таким id немає' })
  findByShowing(
    @Param('id', parseIdPipe) showingId: string,
  ): Promise<BookingResponseDto[]> {
    return this.bookingsService.findByShowing(showingId);
  }

  @Get('showings/:id/seats')
  @ApiOperation({ summary: 'Отримати місця залу із зайнятістю на сеансі' })
  @ApiOkResponse({ type: [ShowingSeat], description: 'Усі місця залу' })
  @ApiNotFoundResponse({ description: 'Сеансу з таким id немає' })
  findSeats(
    @Param('id', parseIdPipe) showingId: string,
  ): Promise<ShowingSeat[]> {
    return this.bookingsService.findSeats(showingId);
  }

  @Delete('bookings/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Скасувати бронювання' })
  @ApiNoContentResponse({ description: 'Бронювання скасовано' })
  @ApiNotFoundResponse({ description: 'Бронювання з таким id немає' })
  remove(@Param('id', parseIdPipe) id: string): Promise<void> {
    return this.bookingsService.remove(id);
  }
}
