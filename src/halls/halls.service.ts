import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateHallDto } from './dto/create-hall.dto.js';
import { Hall, HallWithSeats, Seat } from './entities/hall.entity.js';

@Injectable()
export class HallsService {
  private readonly halls: Hall[] = [];
  private readonly usageChecks: ((hallId: string) => boolean)[] = [];

  // Showings depend on halls, so they report their references through this hook
  // and HallsModule does not have to import ShowingsModule back.
  registerUsageCheck(check: (hallId: string) => boolean) {
    this.usageChecks.push(check);
  }

  create(dto: CreateHallDto): Hall {
    if (this.halls.some((hall) => hall.name === dto.name)) {
      throw new ConflictException(`Hall named "${dto.name}" already exists`);
    }
    const hall: Hall = {
      id: randomUUID(),
      name: dto.name,
      rows: dto.rows,
      seatsPerRow: dto.seatsPerRow,
    };
    this.halls.push(hall);
    return hall;
  }

  findAll(): Hall[] {
    return this.halls;
  }

  findById(id: string): Hall | undefined {
    return this.halls.find((hall) => hall.id === id);
  }

  findOne(id: string): Hall {
    const hall = this.findById(id);
    if (!hall) {
      throw new NotFoundException(`Hall with id "${id}" not found`);
    }
    return hall;
  }

  findOneWithSeats(id: string): HallWithSeats {
    const hall = this.findOne(id);
    return { ...hall, seats: this.listSeats(hall) };
  }

  listSeats(hall: Hall): Seat[] {
    const seats: Seat[] = [];
    for (let row = 1; row <= hall.rows; row++) {
      for (let seat = 1; seat <= hall.seatsPerRow; seat++) {
        seats.push({ row, seat });
      }
    }
    return seats;
  }

  hasSeat(hall: Hall, { row, seat }: Seat): boolean {
    return row <= hall.rows && seat <= hall.seatsPerRow;
  }

  remove(id: string): void {
    const hall = this.findOne(id);
    if (this.usageChecks.some((isUsed) => isUsed(id))) {
      throw new ConflictException(
        `Hall with id "${id}" is referenced by a showing`,
      );
    }
    this.halls.splice(this.halls.indexOf(hall), 1);
  }
}
