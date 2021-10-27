import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { RoleRepository } from '../role/role.repository';
import { status } from 'src/shared/entity-status.num';
import { ReadUserDto } from './dtos/read-user.dto';
import { plainToClass } from 'class-transformer';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly _userRepository: UserRepository,
    @InjectRepository(RoleRepository)
    private readonly _roleRepository: RoleRepository,
  ) {}

  async get(id: number): Promise<ReadUserDto> {
    if (!id) {
      throw new BadRequestException('id must be sent');
    }
    const user: User = await this._userRepository.findOne(id, {
      where: { status: status.ACTIVE },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return plainToClass(ReadUserDto, user);
  }

  async getAll(): Promise<ReadUserDto[]> {
    const users: User[] = await this._userRepository.find({
      where: { status: status.ACTIVE },
    });

    return users.map((user: User) => plainToClass(ReadUserDto, user));
  }

  // async create(user: User) {
  //   const detail = new UserDetail();
  //   user.detail = detail;

  //   const repo = await getConnection().getRepository(Role);
  //   const defaultRole = await repo.findOne({ where: { name: 'GENERAL' } });
  //   user.roles = [defaultRole];

  //   const savedUser = await this._userRepository.save(user);
  //   return savedUser;
  // }

  async update(userId: number, user: UpdateUserDto): Promise<ReadUserDto> {
    const userExists = await this._userRepository.findOne(userId, {
      where: { status: status.ACTIVE },
    });

    if (!userExists) {
      throw new NotFoundException('User does not exists');
    }

    userExists.username = user.username;

    const updateUser = await this._userRepository.save(userExists);
    return plainToClass(ReadUserDto, updateUser);
  }

  async delete(userId: number): Promise<void> {
    const userExists = await this._userRepository.findOne(userId, {
      where: { status: status.ACTIVE },
    });

    if (!userExists) {
      throw new NotFoundException();
    }
    await this._userRepository.update(userId, { status: 'INACTIVE' });
  }

  async setRoleUser(userId: number, roleId: number): Promise<boolean> {
    const userExists = await this._userRepository.findOne(userId, {
      where: { status: status.ACTIVE },
    });

    const roleExists = await this._roleRepository.findOne(roleId, {
      where: { status: status.ACTIVE },
    });

    if (!userExists || !roleExists) {
      throw new NotFoundException();
    }

    userExists.roles.push(roleExists);
    await this._userRepository.save(userExists);

    return true;
  }
}
