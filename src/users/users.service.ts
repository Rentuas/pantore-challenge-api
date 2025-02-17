import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ICreateUser } from './interfaces/create-user.interface';
import { IUpdateUser } from './interfaces/update-user.interface';
import { IPaginatedResponse } from 'src/common/dto/pagination.dto';
import { IUserSearchQuery } from './interfaces/search-user.interface';
import {
  hashPassword,
  validatePasswordStrength,
} from 'src/common/utils/password.utils';
import { ErrorCodes } from 'src/common/errors/error-codes.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(createUser: ICreateUser): Promise<User> {
    try {
      if (!validatePasswordStrength(createUser.password)) {
        throw new BadRequestException(
          'A senha deve ter pelo menos 8 caracteres, incluir letras maiúsculas e minúsculas, números e caracteres especiais.',
        );
      }

      const hashedPassword = await hashPassword(createUser.password);

      const user = this.userRepository.create({
        ...createUser,
        password: hashedPassword,
      });

      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === ErrorCodes.UNIQUE_VIOLATION) {
        throw new ConflictException('Email já está em uso');
      }
      throw error;
    }
  }

  async update(id: number, updateUser: IUpdateUser): Promise<User> {
    try {
      const result = await this.userRepository.update(id, updateUser);

      if (result.affected === 0) {
        throw new NotFoundException('User not found');
      }

      return this.userRepository.findOne({ where: { id } });
    } catch (error) {
      if (error.code === ErrorCodes.UNIQUE_VIOLATION) {
        throw new ConflictException('Email já está em uso');
      }
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }

  async findAll({
    page = 1,
    limit = 10,
    sort = 'DESC',
    sortBy = 'created_at',
    search,
  }: IUserSearchQuery): Promise<IPaginatedResponse<User>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (search) {
      queryBuilder.andWhere(
        `(LOWER(user.name) LIKE LOWER(:search) 
          OR user.email LIKE :search)`,
        { search: `%${search}%` },
      );
    }

    const [data, total] = await queryBuilder
      .select([
        'user.id',
        'user.name',
        'user.email',
        'user.role',
        'user.createdAt',
        'user.updatedAt',
      ])
      .orderBy(`user.${sortBy}`, sort as 'ASC' | 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      total,
      page,
      limit,
      data,
    };
  }
}
