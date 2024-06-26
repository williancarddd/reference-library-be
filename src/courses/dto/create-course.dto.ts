import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({
    example: 'Computer Science',
    description: 'Name of the course',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'PPC of Computer Science',
    description: 'Project Pedagogical Course',
  })
  @IsString()
  ppc: string;

  @ApiProperty({
    example: 'This is a computer science course.',
    description: 'Description of the course',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
