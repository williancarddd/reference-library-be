import { IsString, IsInt, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CreateReferenceDto {
  @ApiProperty({
    example: 'Introduction to Algorithms',
    description: 'Title of the reference',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example:
      'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein',
    description: 'Authors of the reference',
  })
  @IsString()
  authors: string;

  @ApiProperty({
    example: 2009,
    description: 'Year of publication',
    required: false,
  })
  @IsOptional()
  @IsInt()
  year?: number;

  @ApiProperty({
    example: 3,
    description: 'Edition of the reference',
    required: false,
  })
  @IsOptional()
  @IsInt()
  edition?: number;

  @ApiProperty({
    example: 'MIT Press',
    description: 'Publisher of the reference',
    required: false,
  })
  @IsOptional()
  @IsString()
  publisher?: string;

  @ApiProperty({ description: 'Type of the reference' })
  @IsString()
  type: string;

  @ApiProperty({
    example: 1,
    description: 'Course ID to which the reference belongs',
  })
  @IsInt()
  courseId: number;

  @ApiProperty({
    example: 1,
    description: 'Discipline ID to which the reference belongs',
  })
  @IsInt()
  disciplineId: number;
}
