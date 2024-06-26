import { Injectable } from '@nestjs/common';
import { Reference, Prisma } from '@prisma/client';
import { CreateReferenceDto } from './dto/create-reference.dto';
import { UpdateReferenceDto } from './dto/update-reference.dto';
import { createPaginator } from 'prisma-pagination';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { PaginatedOutputDto } from 'src/pagination/Dto/ PaginatedOutputDto';

@Injectable()
export class ReferenceService {
  constructor(private prisma: PrismaService) {}

  async createReference(data: CreateReferenceDto): Promise<Reference> {
    return this.prisma.reference.create({
      data,
    });
  }

  async getReferenceById(id: number): Promise<Reference | null> {
    return this.prisma.reference.findUnique({
      where: { id },
    });
  }

  async getReferences(
    page: number,
    perPage: number,
  ): Promise<PaginatedOutputDto<Reference>> {
    const paginate = createPaginator({ perPage });

    const paginatedReferences = await paginate<
      Reference,
      Prisma.ReferenceFindManyArgs
    >(
      this.prisma.reference,
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

    return paginatedReferences;
  }

  async updateReference(
    id: number,
    data: UpdateReferenceDto,
  ): Promise<Reference> {
    return this.prisma.reference.update({
      where: { id },
      data,
    });
  }

  async deleteReference(id: number): Promise<Reference> {
    return this.prisma.reference.delete({
      where: { id },
    });
  }
}
