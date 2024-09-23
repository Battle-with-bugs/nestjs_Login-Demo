import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import RegisterDto from './auth.dto';
import PostgresErrorCode from 'src/database/postgresErrorCodes.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService
  ) { }

  public async register(registrationData: RegisterDto) {
    const saltOrRounds = 10;
    const salt = await bcrypt.genSalt(saltOrRounds);
    const userPassword = registrationData.password
    const hashPassword = await bcrypt.hash(userPassword, salt);
    registrationData.password = hashPassword
    const checkAccount = await this.usersService.getByAccount(registrationData.accountName) ? true : false;
    const checkEmail = await this.usersService.getByEmail(registrationData.email) ? true : false;
    console.log(checkAccount, checkEmail);
    if (checkAccount === false && checkEmail === false) {
      const dataUser = await this.usersService.create(registrationData);
      return dataUser
    } else if (checkAccount) {
      throw new HttpException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: [
          'Tài khoản đã tồn tại, hãy lấy tên tài khoản khác!',
        ],
        error: 'BAD REQUEST'
      },
        HttpStatus.UNPROCESSABLE_ENTITY
      )
    } else if (checkEmail) {
      throw new HttpException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: [
          'Email đã đang ký tài khản, hãy lấy email khác!',
        ],
        error: 'BAD REQUEST'
      },
        HttpStatus.UNPROCESSABLE_ENTITY
      )
    }

  }

}
