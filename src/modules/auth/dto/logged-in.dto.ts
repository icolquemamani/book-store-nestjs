import { Expose, Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { ReadUserDto } from '../../user/dtos/read-user.dto';

export class LoggedInDto {
  @Expose()
  @IsString()
  token: string;

  @Expose()
  @Type(() => ReadUserDto)
  user: ReadUserDto;
}
