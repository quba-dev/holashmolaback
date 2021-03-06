import {Resolver, Query, Mutation, Args, Int, Context} from '@nestjs/graphql';

import { Account } from './entities/account.entity';
import { CreateUserInput } from './dto/create-account.input';
import {UseGuards} from "@nestjs/common";

import {AccountsService} from "./accounts.service";
import {LoginResponse} from "./dto/login-response.dto";
import {LoginUserInput} from "./dto/login-user.input";
import {User} from "../decorators/user.decorator";
import {changePasswordInput} from "./dto/changePassword.input";
import {JwtAuthGuard} from "./jwt-auth.guard";

@Resolver(() => Account)
export class AccountsResolver {
  constructor(private readonly accountsService: AccountsService) {}

  @Mutation(() => LoginResponse)
  login(@Args('loginUserInput') loginUserInput: LoginUserInput){
    return this.accountsService.login(loginUserInput);
  }

  @Mutation(()=> Account)
  signup(@Args('createUserInput') createUserInput: CreateUserInput, @Context() context){
    return this.accountsService.registration(createUserInput);
  }

  @Query(()=>Account, { name: 'profile'})
  @UseGuards(JwtAuthGuard)
  profile(@User() currentUser: Account){
    return this.accountsService.profile(currentUser)
  }

  @Mutation(()=>Account, { name: 'changePassword'})
  @UseGuards(JwtAuthGuard)
  changePassword(@Args('changePassword') changePassword: changePasswordInput, @User() currentUser: Account){
    return this.accountsService.changePassword(currentUser, changePassword)
  }

}
