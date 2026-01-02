import { Body, Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { ReportsService } from "./reports.service";

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) { }
  
  @Get('course-disciplines')
  @ApiOperation({ summary: 'Report course disciplines' })
  async reportCourseDisciplines() {
    return this.reportsService.reportCourseDisciplines();
  }
  
  @Get('course-references/:id')
  @ApiOperation({ summary: 'Report course references' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  async reportReferences(@Param('id') id: string) {
    return this.reportsService.reportReferences(+id);
  }

  @Get('copies-by-reference/:courseId')
  @ApiOperation({ 
    summary: 'Número de exemplares por referência',
    description: 'Mostra quantos livros existem para cada referência, agrupado por edição. Permite identificar referências sem exemplares.'
  })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  async reportCopiesByReference(@Param('courseId') courseId: string) {
    return this.reportsService.reportCopiesByReference(+courseId);
  }

  @Get('copies-by-discipline/:courseId')
  @ApiOperation({ 
    summary: 'Número de exemplares por disciplina',
    description: 'Mostra quantos livros existem para cada disciplina. Permite identificar disciplinas com muitos ou poucos exemplares.'
  })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  async reportCopiesByDiscipline(@Param('courseId') courseId: string) {
    return this.reportsService.reportCopiesByDiscipline(+courseId);
  }

  @Get('coverage-by-discipline/:courseId')
  @ApiOperation({ 
    summary: 'Porcentagem de cobertura por disciplina',
    description: 'Mostra para cada disciplina qual % das referências da ementa possui exemplares na biblioteca.'
  })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  async reportCoverageByDiscipline(@Param('courseId') courseId: string) {
    return this.reportsService.reportCoverageByDiscipline(+courseId);
  }

  @Get('shared-references/:courseId')
  @ApiOperation({ 
    summary: 'Referências compartilhadas entre disciplinas',
    description: 'Identifica referências usadas por múltiplas disciplinas. Útil para priorizar aquisição de livros com alta demanda.'
  })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  async reportSharedReferences(@Param('courseId') courseId: string) {
    return this.reportsService.reportSharedReferences(+courseId);
  }
}
