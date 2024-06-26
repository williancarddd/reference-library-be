import { Module } from '@nestjs/common';
import { HourController } from './hours.controller';
import { HourService } from './hours.service';

@Module({
  controllers: [HourController],
  providers: [HourService],
})
export class HoursModule {}
