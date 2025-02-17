import { IsString, IsEmail, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/common/enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João das Neves',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Endereço de e-mail do usuário',
    example: 'joao.das.neves@email.com',
  })
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'strongPassword123',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Função do usuário',
    example: UserRole.CLIENT,
  })
  @IsEnum(UserRole, { message: 'Função inválida' })
  role: UserRole;
}
