import { EntityRepository, getConnection, Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { SignupDto } from './dto';
import { RoleRepository } from '../role/role.repository';
import { Role } from '../role/role.entity';
import { RoleType } from '../role/roletype.enum';
import { UserDetail } from '../user/user.details.entity';
import { genSalt, hash } from 'bcryptjs';

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
  async signup(signupDto: SignupDto) {
    const { username, email, password } = signupDto;
    const user = new User();
    user.username = username;
    user.email = email;

    const roleRepository: RoleRepository = await getConnection().getRepository(
      Role,
    );

    const defaultRole: Role = await roleRepository.findOne({
      where: { name: RoleType.GENERAL },
    });

    user.roles = [defaultRole];

    const detail = new UserDetail();
    user.detail = detail;

    const salt = await genSalt(10);
    user.password = await hash(password, salt);

    await user.save();
  }
}
