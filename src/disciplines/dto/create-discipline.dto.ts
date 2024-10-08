import { IsString, IsInt, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDisciplineDto {
  @ApiProperty({
    example: 'Mathematics',
    description: 'Name of the discipline',
  })
  @IsString()
  name: string;

  @ApiProperty({ example: 120, description: 'Carga horaria da disciplina' })
  @IsInt()
  cargaHoraria: number;

  @ApiProperty({ example: 1, description: 'Period of the discipline' })
  @IsInt()
  period: number;

  @ApiProperty({
    example: 1,
    description: 'Course ID to which the discipline belongs',
  })
  @IsInt()
  courseId: number;

  @ApiProperty({
    example: 60,
    description: 'Practical hours of the discipline',
  })
  @IsInt()
  practicalHours: number;


  @ApiProperty({
    example: 60,
    description: 'Theoretical hours of the discipline',
  })
  @IsInt()
  theoreticalHours: number;
}
