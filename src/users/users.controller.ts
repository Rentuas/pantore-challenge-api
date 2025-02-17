import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { PaginatedUserResponseDto } from './dtos/paginated-users-response.dto';
import { UserSearchRequestDto } from './dtos/user-search-request.dto';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiCreatedResponse({
    type: PaginatedUserResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  async list(@Query() searchQueryDto: UserSearchRequestDto) {
    return this.usersService.findAll(searchQueryDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    type: UserResponseDto,
  })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    type: UserResponseDto,
  })
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  async delete(@Param('id') id: number) {
    return this.usersService.delete(id);
  }
}
