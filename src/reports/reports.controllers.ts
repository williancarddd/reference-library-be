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
  async reportReferences(@Param('id') id: string){
    return this.reportsService.reportReferences(+id);
  }
}
