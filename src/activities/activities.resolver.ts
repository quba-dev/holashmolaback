import {Resolver, Query, Mutation, Args, Int, Context} from '@nestjs/graphql';
import { ActivitiesService } from './activities.service';
import { Activity } from './entities/activity.entity';
import { CreateActivityInput } from './dto/create-activity.input';
import {DateIntervalInput} from "./dto/dateInterval.input";
import {dayInput} from "./dto/day.input";
import {Location} from "../locations/entities/location.entity";
import {User} from "../decorators/user.decorator";
import {Account} from "../accounts/entities/account.entity";
import {UseGuards} from "@nestjs/common";
import {JwtAuthGuard} from "../accounts/jwt-auth.guard";
import {UpdateActivityInput} from "./dto/update-activity.input";


@Resolver(() => Activity)
export class ActivitiesResolver {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Mutation(() => Activity)
  @UseGuards(JwtAuthGuard)
  createActivity(@Args('createActivityInput') createActivityInput: CreateActivityInput, @Context() context, @User() currentUser: Account ) {
    return this.activitiesService.createActivity(createActivityInput, currentUser);
  }


  @Query(() => [Activity], { name: 'dates' })
  findActivityLocationAvailable(@Args('dateIntervalInput') dateIntervalInput: DateIntervalInput ) {
    return this.activitiesService.findActivityAvailable(dateIntervalInput);
  }

  @Query(()=>[Location], {name: 'availableLocationByDate'})
  availableLocationByDate(@Args('availableLocationByDay') day: dayInput){
    return this.activitiesService.availableLocationByDate(day)
  }

  @Mutation(() => Activity)
  @UseGuards(JwtAuthGuard)
  removeActivity(@Args('id', { type: () => Int }) id: number, @User() currentUser: Account) {
    return this.activitiesService.remove(id, currentUser);
  }


  @Mutation(() => Activity)
  @UseGuards(JwtAuthGuard)
  updateActivity(@Args('updateActivityInput') updateActivityInput: UpdateActivityInput, @User() currentUser: Account) {
    return this.activitiesService.update(updateActivityInput, currentUser);
  }


  @Query(()=> [Activity], { name: 'findAllActivityFromLocationId'})
  @UseGuards(JwtAuthGuard)
  findActLoc(@Args('id', {type: ()=> Int}) id: number){
    return this.activitiesService.findByLocation(id)
  }

  @Query(()=> [Activity], { name: 'findActByUser'})
  @UseGuards(JwtAuthGuard)
  findActByUser(@User() currentUser: Account){
    return this.activitiesService.findAllActivityByUser(currentUser)
  }
}