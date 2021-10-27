import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateRoleDto, ReadRoleDto } from './dtos';
import { Role } from './role.entity';
import { RoleService } from './role.service';
import { UpdateRoleDto } from './dtos/update-role.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly _roleService: RoleService) {}

  @Get(':roleId')
  async getRole(@Param('roleId', ParseIntPipe) roleId: number) {
    return this._roleService.get(roleId);
  }

  @Get()
  async getRoles(): Promise<ReadRoleDto[]> {
    return this._roleService.getAll();
  }

  @Post()
  async createRole(@Body() role: Partial<CreateRoleDto>): Promise<ReadRoleDto> {
    const createdRole = await this._roleService.create(role);
    return createdRole;
  }

  @Patch(':roleId')
  async updateRole(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Body() role: Partial<UpdateRoleDto>,
  ): Promise<ReadRoleDto> {
    return this._roleService.update(roleId, role);
  }

  @Delete(':roleId')
  async deleteRole(@Param('roleId', ParseIntPipe) roleId: number) {
    return this._roleService.delete(roleId);
  }
}
