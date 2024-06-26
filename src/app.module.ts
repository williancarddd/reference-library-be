import { Module } from '@nestjs/common';
import { PrismaModule } from './databases/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auths/auths.module';
import { JwtService } from '@nestjs/jwt';
import { CoursesModule } from './courses/courses.module';
import { DisciplinesModule } from './disciplines/disciplines.module';
import { ReferencesModule } from './references/references.module';
import { HoursModule } from './hours/hours.module';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, UsersModule, AuthModule, CoursesModule, DisciplinesModule, ReferencesModule, HoursModule],
  controllers: [],
  providers: [JwtService],
})
export class AppModule {}
