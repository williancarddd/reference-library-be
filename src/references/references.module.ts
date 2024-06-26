import { Module } from '@nestjs/common';
import { ReferenceController } from './references.controller';
import { ReferenceService } from './references.service';

@Module({
  controllers: [ReferenceController],
  providers: [ReferenceService],
})
export class ReferencesModule {}
