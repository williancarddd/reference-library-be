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
import { Course as CourseModel } from '@prisma/client';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CourseService } from './courses.service';
import { ApiPaginatedResponse } from 'src/pagination/Dto/pagination.decorator';
import { PaginatedOutputDto } from 'src/pagination/Dto/ PaginatedOutputDto';
import { JwtAuthGuard } from 'src/auths/jwt-auth.guard';

@ApiTags('course')
@Controller('course')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo curso' })
  @ApiResponse({ status: 201, description: 'O curso foi criado com sucesso.' })
  async createCourse(
    @Body() createCourseDto: CreateCourseDto,
  ): Promise<CourseModel> {
    return this.courseService.createCourse(createCourseDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtém um curso pelo ID' })
  @ApiResponse({ status: 200, description: 'O curso foi encontrado.' })
  @ApiResponse({ status: 404, description: 'Curso não encontrado.' })
  async getCourseById(@Param('id') id: string): Promise<CourseModel | null> {
    return this.courseService.getCourseById(Number(id));
  }

  @Get()
  @ApiOperation({ summary: 'Obtém todos os cursos' })
  @ApiPaginatedResponse(UpdateCourseDto)
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'perPage', required: false, example: 10 })
  async getCourses(
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 10,
  ): Promise<PaginatedOutputDto<CourseModel>> {
    return this.courseService.getCourses(page, perPage);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza um curso' })
  @ApiResponse({
    status: 200,
    description: 'O curso foi atualizado com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Curso não encontrado.' })
  async updateCourse(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<CourseModel> {
    return this.courseService.updateCourse(Number(id), updateCourseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleta um curso' })
  @ApiResponse({
    status: 200,
    description: 'O curso foi deletado com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Curso não encontrado.' })
  async deleteCourse(@Param('id') id: string): Promise<CourseModel> {
    return this.courseService.deleteCourse(Number(id));
  }
}
