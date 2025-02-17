import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './../users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './../entities/user.entity';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as passwordUtils from 'src/common/utils/password.utils';
import { faker } from '@faker-js/faker';
import { UserRole } from 'src/common/enums/user-role.enum';
import { ErrorCodes } from 'src/common/errors/error-codes.enum';

const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findOne: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
};

const validPassword = 'Senha123@';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should throw BadRequestException if password is invalid', async () => {
      jest
        .spyOn(passwordUtils, 'validatePasswordStrength')
        .mockReturnValue(false);

      try {
        await service.register({
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: 'weakpassword',
          role: UserRole.CLIENT,
        });
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toBe(
          'A senha deve ter pelo menos 8 caracteres, incluir letras maiúsculas e minúsculas, números e caracteres especiais.',
        );
      }
    });

    it('should create and save a user successfully', async () => {
      jest
        .spyOn(passwordUtils, 'validatePasswordStrength')
        .mockReturnValue(true);
      jest
        .spyOn(passwordUtils, 'hashPassword')
        .mockResolvedValue('hashedPassword');

      const user = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: validPassword,
        role: UserRole.CLIENT,
      };

      mockRepository.create.mockReturnValue(user);
      mockRepository.save.mockResolvedValue(user as User);

      const result = await service.register(user);

      expect(mockRepository.create).toHaveBeenCalledWith({
        ...user,
        password: 'hashedPassword',
      });
      expect(mockRepository.save).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });

    it('should throw ConflictException if email is already in use', async () => {
      const error = { code: ErrorCodes.UNIQUE_VIOLATION };
      mockRepository.save.mockRejectedValue(error);

      await expect(
        service.register({
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: validPassword,
          role: UserRole.CLIENT,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if user is not found', async () => {
      const id = 1;
      const updateUser = { name: faker.person.fullName() };
      mockRepository.update.mockResolvedValue({ affected: 0 });

      try {
        await service.update(id, updateUser);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe('User not found');
      }
    });

    it('should update a user successfully', async () => {
      const id = 1;
      const updateUser = { name: faker.person.fullName() };
      const updatedUser = { ...updateUser, id } as User;
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOne.mockResolvedValue(updatedUser);

      const result = await service.update(id, updateUser);

      expect(mockRepository.update).toHaveBeenCalledWith(id, updateUser);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(updatedUser);
    });

    it('should throw ConflictException if email is already in use during update', async () => {
      const error = { code: ErrorCodes.UNIQUE_VIOLATION };
      mockRepository.update.mockRejectedValue(error);

      try {
        await service.update(1, {
          name: faker.person.fullName(),
          email: faker.internet.email(),
        });
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
        expect(e.message).toBe('Email já está em uso');
      }
    });
  });

  describe('delete', () => {
    it('should throw NotFoundException if user is not found', async () => {
      const id = 1;
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      try {
        await service.delete(id);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe('User not found');
      }
    });

    it('should delete a user successfully', async () => {
      const id = 1;
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.delete(id);

      expect(mockRepository.delete).toHaveBeenCalledWith(id);
    });
  });

  describe('findAll', () => {
    it('should return a paginated response', async () => {
      const query = { page: 1, limit: 10, search: 'John' };
      const expectedResponse = {
        total: 0,
        page: 1,
        limit: 10,
        data: [],
      };

      const result = await service.findAll(query);

      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(expectedResponse);
    });
  });
});
