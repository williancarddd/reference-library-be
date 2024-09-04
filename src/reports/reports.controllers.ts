import { Controller, Get } from "@nestjs/common";
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
}