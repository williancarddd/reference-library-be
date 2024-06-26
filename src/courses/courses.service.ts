import { Injectable } from '@nestjs/common';
import { Course } from '@prisma/client';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/databases/prisma/prisma.service';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async createCourse(data: CreateCourseDto): Promise<Course> {
    return this.prisma.course.create({
      data,
    });
  }

  async getCourseById(id: number): Promise<Course | null> {
    return this.prisma.course.findUnique({
      where: { id },
    });
  }

  async getCourses(): Promise<Course[]> {
    return this.prisma.course.findMany();
  }

  async updateCourse(id: number, data: UpdateCourseDto): Promise<Course> {
    return this.prisma.course.update({
      where: { id },
      data,
    });
  }

  async deleteCourse(id: number): Promise<Course> {
    return this.prisma.course.delete({
      where: { id },
    });
  }
}
