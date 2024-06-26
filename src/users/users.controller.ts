import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PaginatedOutputDto } from 'src/pagination/Dto/ PaginatedOutputDto';
import { ApiPaginatedResponse } from 'src/pagination/Dto/pagination.decorator';
import { UserService } from './users.service';
import { JwtAuthGuard } from 'src/auths/jwt-auth.guard';

@ApiTags('user')
@Controller('user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  //@Post()
  @ApiOperation({ summary: 'Cria um novo usuário' })
  @ApiResponse({
    status: 201,
    description: 'O usuário foi criado com sucesso.',
  })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserModel> {
    return this.userService.createUser(createUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtém um usuário pelo ID' })
  @ApiResponse({ status: 200, description: 'O usuário foi encontrado.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async getUserById(@Param('id') id: string): Promise<UserModel | null> {
    return this.userService.getUserById(Number(id));
  }

  @Get()
  @ApiOperation({ summary: 'Obtém todos os usuários' })
  @ApiPaginatedResponse(CreateUserDto)
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'perPage', required: false, example: 10 })
  async getUsers(
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 10,
  ): Promise<PaginatedOutputDto<UserModel>> {
    return this.userService.getUsers(page, perPage);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza um usuário' })
  @ApiResponse({
    status: 200,
    description: 'O usuário foi atualizado com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserModel> {
    return this.userService.updateUser(Number(id), updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleta um usuário' })
  @ApiResponse({
    status: 200,
    description: 'O usuário foi deletado com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async deleteUser(@Param('id') id: string): Promise<UserModel> {
    return this.userService.deleteUser(Number(id));
  }
}
