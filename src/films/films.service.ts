import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateFilmDto } from './dto/create-film.dto.js';
import { UpdateFilmDto } from './dto/update-film.dto.js';
import { Film } from './entities/film.entity.js';

@Injectable()
export class FilmsService {
  private readonly films: Film[] = [];
  private readonly usageChecks: ((filmId: string) => boolean)[] = [];

  // Showings depend on films, so they report their references through this hook
  // and FilmsModule does not have to import ShowingsModule back.
  registerUsageCheck(check: (filmId: string) => boolean) {
    this.usageChecks.push(check);
  }

  create(dto: CreateFilmDto): Film {
    const film: Film = {
      id: randomUUID(),
      title: dto.title,
      durationMinutes: dto.durationMinutes,
      releaseYear: dto.releaseYear,
    };
    this.films.push(film);
    return film;
  }

  findAll(): Film[] {
    return this.films;
  }

  findById(id: string): Film | undefined {
    return this.films.find((film) => film.id === id);
  }

  findOne(id: string): Film {
    const film = this.findById(id);
    if (!film) {
      throw new NotFoundException(`Film with id "${id}" not found`);
    }
    return film;
  }

  update(id: string, dto: UpdateFilmDto): Film {
    const film = this.findOne(id);
    film.title = dto.title ?? film.title;
    film.durationMinutes = dto.durationMinutes ?? film.durationMinutes;
    film.releaseYear = dto.releaseYear ?? film.releaseYear;
    return film;
  }

  remove(id: string): void {
    const film = this.findOne(id);
    if (this.usageChecks.some((isUsed) => isUsed(id))) {
      throw new ConflictException(
        `Film with id "${id}" is referenced by a showing`,
      );
    }
    this.films.splice(this.films.indexOf(film), 1);
  }
}
