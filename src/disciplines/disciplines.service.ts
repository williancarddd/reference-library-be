import { Injectable } from '@nestjs/common';
import { Discipline, Prisma } from '@prisma/client';
import { CreateDisciplineDto } from './dto/create-discipline.dto';
import { UpdateDisciplineDto } from './dto/update-discipline.dto';
import { createPaginator } from 'prisma-pagination';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { PaginatedOutputDto } from 'src/pagination/Dto/ PaginatedOutputDto';

@Injectable()
export class DisciplineService {
  constructor(private prisma: PrismaService) {}

  async createDiscipline(data: CreateDisciplineDto): Promise<Discipline> {
    return this.prisma.discipline.create({
      data,
    });
  }

  async getDisciplineById(id: number): Promise<Discipline | null> {
    return this.prisma.discipline.findUnique({
      where: { id },
    });
  }

  async getDisciplines(
    page: number,
    perPage: number,
  ): Promise<PaginatedOutputDto<Discipline>> {
    const paginate = createPaginator({ perPage });

    const paginatedDisciplines = await paginate<
      Discipline,
      Prisma.DisciplineFindManyArgs
    >(
      this.prisma.discipline,
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

    return paginatedDisciplines;
  }

  async updateDiscipline(
    id: number,
    data: UpdateDisciplineDto,
  ): Promise<Discipline> {
    return this.prisma.discipline.update({
      where: { id },
      data,
    });
  }

  async deleteDiscipline(id: number): Promise<Discipline> {
    return this.prisma.discipline.delete({
      where: { id },
    });
  }
}
