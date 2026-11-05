import dataSource from './data-source.js';
import { BookingSeat } from './bookings/entities/booking-seat.entity.js';
import { Booking } from './bookings/entities/booking.entity.js';
import { Film } from './films/entities/film.entity.js';
import { Hall } from './halls/entities/hall.entity.js';
import { Showing } from './showings/entities/showing.entity.js';

// Fixed ids make the script idempotent: a second run hits the primary keys
// (or the unique hall name / seat index), and ON CONFLICT DO NOTHING skips the row.
const films = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    title: 'Тіні забутих предків',
    durationMinutes: 97,
    releaseYear: 1965,
  },
  {
    id: '11111111-1111-4111-8111-222222222222',
    title: 'Захар Беркут',
    durationMinutes: 97,
    releaseYear: 1971,
  },
] satisfies Partial<Film>[];

const halls = [
  {
    id: '22222222-2222-4222-8222-111111111111',
    name: 'Синій зал',
    rows: 3,
    seatsPerRow: 5,
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    name: 'Малий зал',
    rows: 2,
    seatsPerRow: 4,
  },
] satisfies Partial<Hall>[];

const showings = [
  {
    id: '33333333-3333-4333-8333-111111111111',
    filmId: films[0].id,
    hallId: halls[0].id,
    startsAt: new Date('2030-06-15T18:00:00.000Z'),
    price: 12500,
  },
  {
    id: '33333333-3333-4333-8333-222222222222',
    filmId: films[1].id,
    hallId: halls[1].id,
    startsAt: new Date('2030-06-16T12:00:00.000Z'),
    price: 8000,
  },
  {
    id: '33333333-3333-4333-8333-333333333333',
    filmId: films[0].id,
    hallId: halls[1].id,
    startsAt: new Date('2030-06-17T20:30:00.000Z'),
    price: 15000,
  },
  {
    id: '33333333-3333-4333-8333-444444444444',
    filmId: films[1].id,
    hallId: halls[0].id,
    startsAt: new Date('2030-06-18T16:00:00.000Z'),
    price: 10000,
  },
] satisfies Partial<Showing>[];

const bookingSeats = [
  { row: 1, seat: 1 },
  { row: 1, seat: 2 },
];

const booking = {
  id: '44444444-4444-4444-8444-111111111111',
  showingId: showings[0].id,
  totalPrice: showings[0].price * bookingSeats.length,
} satisfies Partial<Booking>;

const seats = bookingSeats.map(
  ({ row, seat }, index) =>
    ({
      id: `55555555-5555-4555-8555-${String(index + 1).padStart(12, '0')}`,
      bookingId: booking.id,
      showingId: booking.showingId,
      row,
      seat,
    }) satisfies Partial<BookingSeat>,
);

async function seed() {
  await dataSource.initialize();
  try {
    await dataSource.transaction(async (manager) => {
      const insert = async <T extends object>(
        entity: new () => T,
        rows: Partial<T>[],
      ) => {
        const result = await manager
          .createQueryBuilder()
          .insert()
          .into(entity)
          .values(rows as never)
          .orIgnore()
          .execute();
        const created = result.raw as unknown[];
        console.log(
          `${entity.name}: ${created.length} created, ${rows.length - created.length} already present`,
        );
      };

      await insert(Film, films);
      await insert(Hall, halls);
      await insert(Showing, showings);
      await insert(Booking, [booking]);
      await insert(BookingSeat, seats);
    });
    console.log('Seed completed');
  } finally {
    await dataSource.destroy();
  }
}

await seed();
