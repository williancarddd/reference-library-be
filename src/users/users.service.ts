import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { PaginatedOutputDto } from 'src/pagination/Dto/ PaginatedOutputDto';
import { createPaginator } from 'prisma-pagination';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async getUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async getUsers(
    page: number,
    perPage: number,
  ): Promise<PaginatedOutputDto<User>> {
    const paginate = createPaginator({ perPage });

    const paginatedUsers = await paginate<User, Prisma.UserFindManyArgs>(
      this.prisma.user,
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

    return paginatedUsers;
  }

  async updateUser(id: number, data: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async deleteUser(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
