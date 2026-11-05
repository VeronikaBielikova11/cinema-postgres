import { Module } from '@nestjs/common';
import { FilmsController } from './films.controller.js';
import { FilmsService } from './films.service.js';

@Module({
  controllers: [FilmsController],
  providers: [FilmsService],
  exports: [FilmsService],
})
export class FilmsModule {}
