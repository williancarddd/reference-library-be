import { Injectable } from '@nestjs/common';
import { Hour, Prisma } from '@prisma/client';
import { CreateHourDto } from './dto/create-hour.dto';
import { UpdateHourDto } from './dto/update-hour.dto';
import { createPaginator } from 'prisma-pagination';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { PaginatedOutputDto } from 'src/pagination/Dto/ PaginatedOutputDto';

@Injectable()
export class HourService {
  constructor(private prisma: PrismaService) {}

  async createHour(data: CreateHourDto): Promise<Hour> {
    return this.prisma.hour.create({
      data,
    });
  }

  async getHourById(id: number): Promise<Hour | null> {
    return this.prisma.hour.findUnique({
      where: { id },
    });
  }

  async getHours(
    page: number,
    perPage: number,
  ): Promise<PaginatedOutputDto<Hour>> {
    const paginate = createPaginator({ perPage });

    const paginatedHours = await paginate<Hour, Prisma.HourFindManyArgs>(
      this.prisma.hour,
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

    return paginatedHours;
  }

  async updateHour(id: number, data: UpdateHourDto): Promise<Hour> {
    return this.prisma.hour.update({
      where: { id },
      data,
    });
  }

  async deleteHour(id: number): Promise<Hour> {
    return this.prisma.hour.delete({
      where: { id },
    });
  }
}
