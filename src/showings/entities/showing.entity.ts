import { ApiProperty } from '@nestjs/swagger';

export class Showing {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  filmId: string;

  @ApiProperty({ format: 'uuid' })
  hallId: string;

  @ApiProperty({
    example: '2030-06-15T18:00:00.000Z',
    description: 'Початок сеансу в UTC',
  })
  startsAt: string;

  @ApiProperty({ example: 12500, description: 'Ціна квитка в копійках' })
  price: number;
}

export class ShowingDetails {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Тіні забутих предків' })
  filmTitle: string;

  @ApiProperty({ example: 'Синій зал' })
  hallName: string;

  @ApiProperty({
    example: '2030-06-15T18:00:00.000Z',
    description: 'Початок сеансу в UTC',
  })
  startsAt: string;

  @ApiProperty({ example: 12500, description: 'Ціна квитка в копійках' })
  price: number;
}
