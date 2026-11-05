import { ApiProperty } from '@nestjs/swagger';

export class Seat {
  @ApiProperty({ example: 1, minimum: 1 })
  row: number;

  @ApiProperty({ example: 1, minimum: 1 })
  seat: number;
}

export class Hall {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Синій зал' })
  name: string;

  @ApiProperty({ example: 3 })
  rows: number;

  @ApiProperty({ example: 5 })
  seatsPerRow: number;
}

export class HallWithSeats extends Hall {
  @ApiProperty({ type: [Seat] })
  seats: Seat[];
}
