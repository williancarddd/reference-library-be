import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHourDto {
  @ApiProperty({ example: 40, description: 'Número de horas teóricas' })
  @IsInt()
  theoreticalHours: number;

  @ApiProperty({ example: 20, description: 'Número de horas práticas' })
  @IsInt()
  practicalHours: number;

  @ApiProperty({ example: 1, description: 'ID da disciplina associada' })
  @IsInt()
  disciplineId: number;

  @ApiProperty({ example: 1, description: 'ID do curso associado' })
  @IsInt()
  courseId: number;
}
