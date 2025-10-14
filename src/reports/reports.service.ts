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

 async reportReferences(id: number) {
  const references = await this.prismaService.reference.findMany({
    where: {
      courseId: id
    },
    select: {
      title: true
    }
  }).then(refs => refs.map(ref => ref.title));

  const books = await this.prismaService.book.findMany({
    where: {
      title: {
        in: references
      }
    }
  });

  const referencesBooks = books.reduce((aggregator, book) => {
    if (!aggregator[book.title]) {
      aggregator[book.title] = {
        editions: {},
        total: 0,
      };
    }

    // If the edition already exists, increment, else set to 1.
    if (aggregator[book.title].editions[book.edition]) {
      aggregator[book.title].editions[book.edition] += 1;
    } else {
      aggregator[book.title].editions[book.edition] = 1;
    }
    aggregator[book.title].total += 1;

    return aggregator;
  }, {});

  return referencesBooks;
}
}
