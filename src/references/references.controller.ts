import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { Reference as ReferenceModel } from '@prisma/client';
import { CreateReferenceDto } from './dto/create-reference.dto';
import { UpdateReferenceDto } from './dto/update-reference.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PaginatedOutputDto } from 'src/pagination/Dto/ PaginatedOutputDto';
import { ApiPaginatedResponse } from 'src/pagination/Dto/pagination.decorator';
import { ReferenceService } from './references.service';

@ApiTags('reference')
@Controller('reference')
export class ReferenceController {
  constructor(private readonly referenceService: ReferenceService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova referência' })
  @ApiResponse({
    status: 201,
    description: 'A referência foi criada com sucesso.',
  })
  async createReference(
    @Body() createReferenceDto: CreateReferenceDto,
  ): Promise<ReferenceModel> {
    return this.referenceService.createReference(createReferenceDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtém uma referência pelo ID' })
  @ApiResponse({ status: 200, description: 'A referência foi encontrada.' })
  @ApiResponse({ status: 404, description: 'Referência não encontrada.' })
  async getReferenceById(
    @Param('id') id: string,
  ): Promise<ReferenceModel | null> {
    return this.referenceService.getReferenceById(Number(id));
  }

  @Get()
  @ApiOperation({ summary: 'Obtém todas as referências' })
  @ApiPaginatedResponse(UpdateReferenceDto)
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'perPage', required: false, example: 10 })
  @ApiQuery({ name: 'disciplineId', required: true, example: 1 })
  async getReferences(
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 10,
    @Query('disciplineId') disciplineId: number = 0,
  ): Promise<PaginatedOutputDto<ReferenceModel>> {
    return this.referenceService.getReferences(page, perPage, disciplineId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza uma referência' })
  @ApiResponse({
    status: 200,
    description: 'A referência foi atualizada com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Referência não encontrada.' })
  async updateReference(
    @Param('id') id: string,
    @Body() updateReferenceDto: UpdateReferenceDto,
  ): Promise<ReferenceModel> {
    return this.referenceService.updateReference(
      Number(id),
      updateReferenceDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleta uma referência' })
  @ApiResponse({
    status: 200,
    description: 'A referência foi deletada com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Referência não encontrada.' })
  async deleteReference(@Param('id') id: string): Promise<ReferenceModel> {
    return this.referenceService.deleteReference(Number(id));
  }
}
