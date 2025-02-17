import { IPagination } from '../../common/dto/pagination.dto';

export interface IUserSearchQuery extends IPagination {
  search?: string;
}
