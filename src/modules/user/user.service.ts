import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';
import { UserDetail } from './user.details.entity';
import { getConnection } from 'typeorm';
import { Role } from '../role/role.entity';
import { RoleRepository } from '../role/role.repository';
import { status } from 'src/shared/entity-status.num';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly _userRepository: UserRepository,
    @InjectRepository(RoleRepository)
    private readonly _roleRepository: RoleRepository,
  ) {}

  async get(id: number): Promise<User> {
    if (!id) {
      throw new BadRequestException('id must be sent');
    }
    const user = await this._userRepository.findOne(id, {
      where: { status: status.ACTIVE },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async getAll(): Promise<User[]> {
    const users: User[] = await this._userRepository.find({
      where: { status: status.ACTIVE },
    });

    return users;
  }

  async create(user: User) {
    const detail = new UserDetail();
    user.detail = detail;

    const repo = await getConnection().getRepository(Role);
    const defaultRole = await repo.findOne({ where: { name: 'GENERAL' } });
    user.roles = [defaultRole];

    const savedUser = await this._userRepository.save(user);
    return savedUser;
  }

  async update(id: number, user: User): Promise<void> {
    await this._userRepository.update(id, user);
  }

  async delete(id: number): Promise<void> {
    const userExists = await this._userRepository.findOne(id, {
      where: { status: status.ACTIVE },
    });

    if (!userExists) {
      throw new NotFoundException();
    }
    await this._userRepository.update(id, { status: 'INACTIVE' });
  }

  async setRoleUser( userId: number, roleId: number) {
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
