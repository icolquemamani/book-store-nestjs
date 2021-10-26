import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../role/decorators/role.decorator';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { RoleGuard } from '../role/guards/role.guard';
import { RoleType } from '../role/roletype.enum';

@Controller('users')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Get(':id')
  // @Roles(RoleType.ADMIN, RoleType.GENERAL)
  // @UseGuards(AuthGuard(), RoleGuard)
  async getUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this._userService.get(id);
    return user;
  }

  @UseGuards(AuthGuard())
  @Get()
  async getUsers(): Promise<User[]> {
    const users = await this._userService.getAll();
    return users;
  }

  @Post()
  async createUser(@Body() user: User): Promise<User> {
    const createdUser = await this._userService.create(user);
    return createdUser;
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: User,
  ): Promise<any> {
    const updatedUser = await this._userService.update(id, user);
    return updatedUser;
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this._userService.delete(id);
  }

  @Post('setRole/:userId/:roleId')
  async setRoleUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
  ) {
    await this._userService.setRoleUser(userId, roleId);
  }
}
