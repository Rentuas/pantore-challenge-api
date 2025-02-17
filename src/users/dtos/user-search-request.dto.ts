import { IsOptional, IsString, Length } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class UserSearchRequestDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @Length(3)
  search: string;
}
