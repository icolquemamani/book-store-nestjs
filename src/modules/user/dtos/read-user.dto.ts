import { Exclude, Type, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { ReadRoleDto } from 'src/modules/role/dtos';
import { RoleType } from '../../role/roletype.enum';
import { UserDetail } from '../user.details.entity';
import { ReadUserDetailDto } from './read-user-detail.dto';

@Exclude()
export class ReadUserDto {
  @Expose()
  @IsNotEmpty()
  readonly id: number;

  @Expose()
  @IsNotEmpty()
  readonly username: string;

  @Expose()
  @IsEmail()
  readonly email: string;

  @Expose()
  @Type((type) => ReadRoleDto)
  readonly roles: ReadRoleDto[];

  @Expose()
  @Type((type) => ReadUserDetailDto)
  readonly detail: ReadUserDetailDto;
}
