import { ApiProperty } from '@nestjs/swagger';
import { Seat } from '../../halls/entities/hall.entity.js';

export class Booking {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  showingId: string;

  @ApiProperty({ type: [Seat] })
  seats: Seat[];

  @ApiProperty({
    example: 25000,
    description: 'Ціна сеансу, помножена на кількість місць, у копійках',
  })
  totalPrice: number;
}

export class ShowingSeat extends Seat {
  @ApiProperty({ example: false })
  isBooked: boolean;
}
