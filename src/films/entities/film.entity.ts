import { ApiProperty } from '@nestjs/swagger';

export class Film {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Тіні забутих предків' })
  title: string;

  @ApiProperty({ example: 97, description: 'Тривалість у хвилинах' })
  durationMinutes: number;

  @ApiProperty({ example: 1965 })
  releaseYear: number;
}
