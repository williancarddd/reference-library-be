import { IsString, IsEmail, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ example: 'john_doe', description: 'Username do usuário' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'password123', description: 'Senha do usuário' })
  @IsString()
  password: string;

  @ApiProperty({
    example: 'john_doe@example.com',
    description: 'Email do usuário',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ enum: UserRole, description: 'Papel do usuário' })
  @IsEnum(UserRole)
  role: UserRole;
}
