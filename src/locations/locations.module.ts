import {forwardRef, Module} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsResolver } from './locations.resolver';
import {TypeOrmModule} from "@nestjs/typeorm";
import { Location } from "./entities/location.entity";
import {AccountsModule} from "../accounts/accounts.module";
import {ActivitiesModule} from "../activities/activities.module";
import {Activity} from "../activities/entities/activity.entity";
import {ActivitiesService} from "../activities/activities.service";

@Module({

  imports: [TypeOrmModule.forFeature([Location]), AccountsModule],
  providers: [LocationsResolver, LocationsService],
  exports: [LocationsService]
})
export class LocationsModule {}
