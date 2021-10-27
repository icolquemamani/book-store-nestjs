import { IsNotEmpty } from 'class-validator';
import { RoleType } from '../../role/roletype.enum';
import { UserDetail } from '../user.details.entity';

export class UpdateUserDto {
  @IsNotEmpty()
  username: string;
}
