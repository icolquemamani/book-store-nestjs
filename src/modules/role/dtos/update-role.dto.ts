import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsString, MaxLength } from 'class-validator';

export class UpdateRoleDto {
  // @Expose()
  // @IsNumber()
  // readonly id: number;
  
  @IsString()
  @MaxLength(50, { message: 'This name is not valid'})
  readonly name: string;

  @IsString()
  @MaxLength(100, { message: 'This name is not valid'})
  readonly description: string;
}