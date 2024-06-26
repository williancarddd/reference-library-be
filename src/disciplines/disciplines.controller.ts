import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Discipline as DisciplineModel } from '@prisma/client';
import { CreateDisciplineDto } from './dto/create-discipline.dto';
import { UpdateDisciplineDto } from './dto/update-discipline.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/pagination/Dto/pagination.decorator';
import { PaginatedOutputDto } from 'src/pagination/Dto/ PaginatedOutputDto';
import { DisciplineService } from './disciplines.service';
import { JwtAuthGuard } from 'src/auths/jwt-auth.guard';

@ApiTags('discipline')
@Controller('discipline')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DisciplineController {
  constructor(private readonly disciplineService: DisciplineService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova disciplina' })
  @ApiResponse({
    status: 201,
    description: 'A disciplina foi criada com sucesso.',
  })
  async createDiscipline(
    @Body() createDisciplineDto: CreateDisciplineDto,
  ): Promise<DisciplineModel> {
    return this.disciplineService.createDiscipline(createDisciplineDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtém uma disciplina pelo ID' })
  @ApiResponse({ status: 200, description: 'A disciplina foi encontrada.' })
  @ApiResponse({ status: 404, description: 'Disciplina não encontrada.' })
  async getDisciplineById(
    @Param('id') id: string,
  ): Promise<DisciplineModel | null> {
    return this.disciplineService.getDisciplineById(Number(id));
  }

  @Get()
  @ApiOperation({ summary: 'Obtém todas as disciplinas' })
  @ApiPaginatedResponse(UpdateDisciplineDto)
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'perPage', required: false, example: 10 })
  async getDisciplines(
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 10,
  ): Promise<PaginatedOutputDto<DisciplineModel>> {
    return this.disciplineService.getDisciplines(page, perPage);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza uma disciplina' })
  @ApiResponse({
    status: 200,
    description: 'A disciplina foi atualizada com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Disciplina não encontrada.' })
  async updateDiscipline(
    @Param('id') id: string,
    @Body() updateDisciplineDto: UpdateDisciplineDto,
  ): Promise<DisciplineModel> {
    return this.disciplineService.updateDiscipline(
      Number(id),
      updateDisciplineDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleta uma disciplina' })
  @ApiResponse({
    status: 200,
    description: 'A disciplina foi deletada com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Disciplina não encontrada.' })
  async deleteDiscipline(@Param('id') id: string): Promise<DisciplineModel> {
    return this.disciplineService.deleteDiscipline(Number(id));
  }
}
