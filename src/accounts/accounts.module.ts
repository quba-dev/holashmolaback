import {Module} from '@nestjs/common';
import {JwtModule} from "@nestjs/jwt";
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtAuthGuard} from "./jwt-auth.guard";
import {AccountsService} from "./accounts.service";
import {Account} from "./entities/account.entity";
import {AccountsResolver} from "./accounts.resolver";

@Module({

  providers: [AccountsResolver, AccountsService,JwtModule,JwtAuthGuard],
  imports: [
    TypeOrmModule.forFeature([Account]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24h'
      }
    }),
  ],
  exports: [
    JwtModule,JwtAuthGuard,AccountsService
  ]
})
export class AccountsModule {}