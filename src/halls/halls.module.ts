import { Module } from '@nestjs/common';
import { HallsController } from './halls.controller.js';
import { HallsService } from './halls.service.js';

@Module({
  controllers: [HallsController],
  providers: [HallsService],
  exports: [HallsService],
})
export class HallsModule {}
