import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Account} from "./entities/account.entity";
import {CreateUserInput} from "./dto/create-account.input";
import {LoginUserInput} from "./dto/login-user.input";


@Injectable()
export class AccountsService {
  constructor(@InjectRepository(Account)
              private readonly userRepository: Repository<Account>,
              private jwtService: JwtService) {}

  async createUser(dto: CreateUserInput){
    const user = new Account()
    Object.assign(user, dto)
    return await this.userRepository.save(user)
  }

  async login(userDto: LoginUserInput) {
    const user = await this.validateUser(userDto)
    const token = await this.generateToken(user)
    return {
      userId: user.id,
      access_token: token.token
    }

  }

  async registration(userDto: CreateUserInput) {
    const email = await this.getUserByEmail(userDto.email);
    const username = await this.getUserByUsername(userDto.username)
    if (email || username) {
      throw new HttpException('Пользователь с таким email или username существует', HttpStatus.BAD_REQUEST);
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    return await this.createUser({...userDto, password: hashPassword})


  }

  private async generateToken(user: Account) {
    const payload = {email: user.email, id: user.id}
    return {
      token: this.jwtService.sign(payload)
    }
  }

  private async validateUser(userDto: LoginUserInput) {
    const user = await this.getUserByEmail(userDto.email);
    const passwordEquals = await bcrypt.compare(userDto.password, user.password);
    if (!user || !passwordEquals) {
      throw new UnauthorizedException({message: 'Некорректный емайл или пароль'})
    }
    return user;
  }

  async getUserByEmail(email:string){
    return await this.userRepository.findOne({where: {email}})
  }

  async getUserByUsername(username: string){
    return await this.userRepository.findOne({where: {username}})
  }
}