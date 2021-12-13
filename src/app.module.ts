import { Module } from '@nestjs/common';
import {GraphQLModule} from "@nestjs/graphql";
import { join} from 'path';
import {TypeOrmModule} from "@nestjs/typeorm";
import ormconfig from "./ormconfig";
import { LocationsModule } from './locations/locations.module';
import { AccountsModule } from './accounts/accounts.module';
import { ActivitiesModule } from './activities/activities.module';


@Module({
  imports: [
      GraphQLModule.forRoot({
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          sortSchema: true
  }),
      AccountsModule,
      ActivitiesModule,
      LocationsModule,
      TypeOrmModule.forRoot(ormconfig),

  ],
})
export class AppModule {}


