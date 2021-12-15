import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import {InjectRepository} from "@nestjs/typeorm";
import {getRepository, Repository} from "typeorm";
import {Account} from "./entities/account.entity";
import {CreateUserInput} from "./dto/create-account.input";
import {LoginUserInput} from "./dto/login-user.input";
import {Activity} from "../activities/entities/activity.entity";
import {Location} from "../locations/entities/location.entity";



@Injectable()
export class AccountsService {
  constructor(@InjectRepository(Account)
              private readonly userRepository: Repository<Account>,
              private jwtService: JwtService) {}

  async createUser(dto: CreateUserInput){
    const user = new Account()
    Object.assign(user, dto)
    return this.userRepository.save(user)
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
    const username = await this.getUserByUsername(userDto.username);
    if (email || username) {
      throw new HttpException('Пользователь с таким email или username существует', HttpStatus.BAD_REQUEST);
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    return this.createUser({...userDto, password: hashPassword});
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
      throw new UnauthorizedException({message: 'Некорректный емайл или пароль'});
    }
    return user;
  }

  async getUserByEmail(email: string){
    return this.userRepository.findOne({where: {email}})
  }

  async getUserByUsername(username: string){
    return this.userRepository.findOne({where: {username}})
  }

  async profile(user){
    const infoUser = await this.jwtService.verify(user)
    const currentUser = await this.userRepository.findOne({id: infoUser.id})
    const activity = getRepository(Activity)
        .createQueryBuilder('activity')
        .where('activity.account.id =:id', {id: currentUser.id})
        .getMany()
    const location = getRepository(Location)
        .createQueryBuilder('location')
        .where('location.account.id =:id', {id: currentUser.id})
        .getMany()
    return {...currentUser, activities: activity, locations: location}
  }

  async changePassword(user, changePasswordDto){
    const infoUser = await this.jwtService.verify(user)
    const {old_password, new_password, confirm_password} = changePasswordDto
    const currentUser = await this.userRepository.findOne({id: infoUser.id})
    const validate = await bcrypt.compare(old_password, currentUser.password);
    if ( !validate){
      throw new UnauthorizedException({message: 'Некорректный пароль'});
    }
    if ( confirm_password !== new_password){
      throw new UnauthorizedException({message: 'Пароли не совпадают'});
    }
    const validateUniq = await bcrypt.compare(new_password, currentUser.password)
    if( validateUniq ){
      throw new UnauthorizedException({message: 'Старый пароль и новый пароль не должны совпадать'});
    }

    const hashPassword = await bcrypt.hash(new_password, 5);
    await this.userRepository.save({...currentUser, password: hashPassword})
    return currentUser
  }
}