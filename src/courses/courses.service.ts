import { Injectable } from '@nestjs/common';
import { Course, Prisma } from '@prisma/client';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { createPaginator } from 'prisma-pagination';
import { PaginatedOutputDto } from 'src/pagination/Dto/ PaginatedOutputDto';
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

  async getCourses(
    page: number,
    perPage: number,
  ): Promise<PaginatedOutputDto<Course>> {
    const paginate = createPaginator({ perPage });

    const paginatedCourses = await paginate<Course, Prisma.CourseFindManyArgs>(
      this.prisma.course,
      {
        where: {},
        orderBy: {
          id: 'desc',
        },
      },
      {
        page,
      },
    );

    return paginatedCourses;
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
