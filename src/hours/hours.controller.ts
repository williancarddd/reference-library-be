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
import { Hour as HourModel } from '@prisma/client';
import { CreateHourDto } from './dto/create-hour.dto';
import { UpdateHourDto } from './dto/update-hour.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { HourService } from './hours.service';
import { JwtAuthGuard } from 'src/auths/jwt-auth.guard';
import { PaginatedOutputDto } from 'src/pagination/Dto/ PaginatedOutputDto';
import { ApiPaginatedResponse } from 'src/pagination/Dto/pagination.decorator';

@ApiTags('hour')
@Controller('hour')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class HourController {
  constructor(private readonly hourService: HourService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova carga horária' })
  @ApiResponse({
    status: 201,
    description: 'A carga horária foi criada com sucesso.',
  })
  async createHour(@Body() createHourDto: CreateHourDto): Promise<HourModel> {
    return this.hourService.createHour(createHourDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtém uma carga horária pelo ID' })
  @ApiResponse({ status: 200, description: 'A carga horária foi encontrada.' })
  @ApiResponse({ status: 404, description: 'Carga horária não encontrada.' })
  async getHourById(@Param('id') id: string): Promise<HourModel | null> {
    return this.hourService.getHourById(Number(id));
  }

  @Get()
  @ApiOperation({ summary: 'Obtém todas as cargas horárias' })
  @ApiPaginatedResponse(UpdateHourDto)
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'perPage', required: false, example: 10 })
  async getHours(
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 10,
  ): Promise<PaginatedOutputDto<HourModel>> {
    return this.hourService.getHours(page, perPage);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza uma carga horária' })
  @ApiResponse({
    status: 200,
    description: 'A carga horária foi atualizada com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Carga horária não encontrada.' })
  async updateHour(
    @Param('id') id: string,
    @Body() updateHourDto: UpdateHourDto,
  ): Promise<HourModel> {
    return this.hourService.updateHour(Number(id), updateHourDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleta uma carga horária' })
  @ApiResponse({
    status: 200,
    description: 'A carga horária foi deletada com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Carga horária não encontrada.' })
  async deleteHour(@Param('id') id: string): Promise<HourModel> {
    return this.hourService.deleteHour(Number(id));
  }
}
