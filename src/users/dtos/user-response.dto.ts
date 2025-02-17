import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/common/enums/user-role.enum';
import { User } from '../entities/user.entity';

export class UserResponseDto {
  @ApiProperty({
    description: 'Identificador único do usuário',
    example: 'b407a07a-d3af-4b93-9cc1-1815c238217c',
  })
  id: string;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João das Neves',
  })
  name: string;

  @ApiProperty({
    description: 'Endereço de email do usuário',
    example: 'joao.das.neves@email.com',
  })
  email: string;

  @ApiProperty({
    description: 'Nível de acesso',
    enum: UserRole,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Data de criação do registro do usuário',
    example: '2025-02-09T17:43:02.266Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização do registro do usuário',
    example: '2025-02-09T17:43:02.266Z',
  })
  updatedAt: Date;
}
