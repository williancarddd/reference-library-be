import { Injectable } from "@nestjs/common";
import { get } from "https";
import { PrismaService } from "src/databases/prisma/prisma.service";

@Injectable()
export class ReportsService {
  constructor(private prismaService: PrismaService) { }

  async reportCourseDisciplines() {
    const getCouserDisciplines = await this.prismaService.course.findMany({
      include: {
        disciplines: true
      },
    });


    const processedFormat = getCouserDisciplines.map((course) => {
      return {
        course: course.name,
        total: course.disciplines.length,
        disciplines: course.disciplines
      }
    });

    return processedFormat;
  }
}