import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsString, Matches } from 'class-validator';

export class FindShowingsQueryDto {
  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Лишити сеанси тільки цього фільму',
  })
  @IsOptional()
  @IsString()
  filmId?: string;

  @ApiPropertyOptional({
    example: '2030-06-15',
    description: 'Лишити сеанси, що починаються цієї доби за UTC',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must match YYYY-MM-DD' })
  @IsISO8601({ strict: true }, { message: 'date must be a real calendar date' })
  date?: string;
}
