import { Module } from '@nestjs/common';
import { PrismaModule } from './databases/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auths/auths.module';
import { JwtService } from '@nestjs/jwt';
import { CoursesModule } from './courses/courses.module';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, UsersModule, AuthModule, CoursesModule],
  controllers: [],
  providers: [JwtService],
})
export class AppModule {}
