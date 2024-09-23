import { Injectable, HttpException, HttpStatus, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import CreateUserDto from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email: email }
    });
    return user;
  }

  async getByAccount(account: string) {
    const user = await this.usersRepository.findOne({
      where: { accountName: account }
    });
    console.log(user);
    
    return user;

  }

  async create(userData: CreateUserDto) {
    const newUser = await this.usersRepository.create(userData);
    console.log(newUser);
    const data = await this.usersRepository.save(newUser);
    return data;
  }

}