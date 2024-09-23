import { Injectable, HttpStatus, HttpException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import {RegisterDto, LoginDto} from './auth.dto';
import PostgresErrorCode from 'src/database/postgresErrorCodes.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService
  ) { }

  public async login(dataLogin: LoginDto) {
    console.log(dataLogin);
      const user = await this.usersService.getByAccount(dataLogin.accountName);
      const isPasswordMatching = await bcrypt.compare(
        dataLogin.password,
        user.password
      );
      if (!isPasswordMatching) {
        throw new UnauthorizedException();
      }
      user.password = undefined;
      return user;
  }

  public async register(registrationData: RegisterDto) {  
    // hash password
    const saltOrRounds = 10;
    const salt = await bcrypt.genSalt(saltOrRounds);
    const userPassword = registrationData.password
    const hashPassword = await bcrypt.hash(userPassword, salt);
    registrationData.password = hashPassword

    const checkAccount = await this.usersService.getByAccount(registrationData.accountName) == null? false : true;
    const checkEmail = await this.usersService.getByEmail(registrationData.email) ==null ? false : true;
    
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
