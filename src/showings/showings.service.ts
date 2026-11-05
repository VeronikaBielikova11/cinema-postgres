import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { FilmsService } from '../films/films.service.js';
import { HallsService } from '../halls/halls.service.js';
import { CreateShowingDto } from './dto/create-showing.dto.js';
import { FindShowingsQueryDto } from './dto/find-showings-query.dto.js';
import { Showing, ShowingDetails } from './entities/showing.entity.js';

@Injectable()
export class ShowingsService implements OnModuleInit {
  private readonly showings: Showing[] = [];

  constructor(
    private readonly filmsService: FilmsService,
    private readonly hallsService: HallsService,
  ) {}

  onModuleInit() {
    this.filmsService.registerUsageCheck((filmId) =>
      this.showings.some((showing) => showing.filmId === filmId),
    );
    this.hallsService.registerUsageCheck((hallId) =>
      this.showings.some((showing) => showing.hallId === hallId),
    );
  }

  create(dto: CreateShowingDto): Showing {
    if (!this.filmsService.findById(dto.filmId)) {
      throw new BadRequestException(`Film with id "${dto.filmId}" not found`);
    }
    if (!this.hallsService.findById(dto.hallId)) {
      throw new BadRequestException(`Hall with id "${dto.hallId}" not found`);
    }
    const showing: Showing = {
      id: randomUUID(),
      filmId: dto.filmId,
      hallId: dto.hallId,
      startsAt: new Date(dto.startsAt).toISOString(),
      price: dto.price,
    };
    this.showings.push(showing);
    return showing;
  }

  findAll({ filmId, date }: FindShowingsQueryDto): ShowingDetails[] {
    return this.showings
      .filter((showing) => !filmId || showing.filmId === filmId)
      .filter((showing) => !date || showing.startsAt.startsWith(date))
      .sort(
        (a, b) =>
          a.startsAt.localeCompare(b.startsAt) || a.id.localeCompare(b.id),
      )
      .map((showing) => this.toDetails(showing));
  }

  findById(id: string): Showing {
    const showing = this.showings.find((showing) => showing.id === id);
    if (!showing) {
      throw new NotFoundException(`Showing with id "${id}" not found`);
    }
    return showing;
  }

  findOne(id: string): ShowingDetails {
    return this.toDetails(this.findById(id));
  }

  private toDetails(showing: Showing): ShowingDetails {
    return {
      id: showing.id,
      filmTitle: this.filmsService.findOne(showing.filmId).title,
      hallName: this.hallsService.findOne(showing.hallId).name,
      startsAt: showing.startsAt,
      price: showing.price,
    };
  }
}
