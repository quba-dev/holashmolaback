import {forwardRef, Module} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesResolver } from './activities.resolver';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Location} from "../locations/entities/location.entity";
import {Activity} from "./entities/activity.entity";
import {LocationsModule} from "../locations/locations.module";
import {LocationsService} from "../locations/locations.service";
import {AccountsModule} from "../accounts/accounts.module";

@Module({
  imports:[TypeOrmModule.forFeature([Activity]),AccountsModule,LocationsModule],
  providers: [ActivitiesResolver, ActivitiesService],
  exports: [ActivitiesService]
})
export class ActivitiesModule {}
