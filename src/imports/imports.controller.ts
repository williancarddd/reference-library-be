import {
	Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportsService } from './imports.service';
import { Express } from 'express'; 
import { CreateCourseDto } from 'src/courses/dto/create-course.dto';



@Controller('imports')
export class ImportsController {
  constructor(private readonly importsService: ImportsService) {}

  @Post('upload-ppc')
  @UseInterceptors(FileInterceptor('file'))
  async uploadppc(@UploadedFile() file: Express.Multer.File, @Body() createCourseDto: CreateCourseDto) {
	  return this.importsService.importFromPPC(file.buffer,createCourseDto);
  }
  
  @Post('upload-book')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBook(@UploadedFile() file: Express.Multer.File) {
	  return this.importsService.importFromCsv(file.buffer);
  }
}
