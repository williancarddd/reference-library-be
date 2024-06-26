import { Module } from '@nestjs/common';
import { DisciplineController } from './disciplines.controller';
import { DisciplineService } from './disciplines.service';

@Module({
  controllers: [DisciplineController],
  providers: [DisciplineService],
})
export class DisciplinesModule {}
