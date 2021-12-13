import {Resolver, Query, Mutation, Args, Int, Context, Parent} from '@nestjs/graphql';
import { LocationsService } from './locations.service';
import { Location } from './entities/location.entity';
import { CreateLocationInput } from './dto/create-location.input';
import {UseGuards} from "@nestjs/common";
import {JwtAuthGuard} from "../accounts/jwt-auth.guard";
import {User} from "../decorators/user.decorator";
import {Account} from "../accounts/entities/account.entity";
import {UpdateLocationInput} from "./dto/update-location.input";
import {Activity} from "../activities/entities/activity.entity";

@Resolver(() => Location)
export class LocationsResolver {
  constructor(private readonly locationsService: LocationsService) {}

  @Mutation(() => Location)
  @UseGuards(JwtAuthGuard)
  createLocation(@Args('createLocationInput') createLocationInput: CreateLocationInput, @User() currentUser: Account) {
    return this.locationsService.createLocation(createLocationInput, currentUser);
  }


  @Mutation(() => Location)
  @UseGuards(JwtAuthGuard)
  removeLocation(@Args('id', { type: () => Int }) id: number, @User() currentUser: Account) {
    return this.locationsService.remove(id, currentUser);
  }


  @Mutation(() => Location)
  @UseGuards(JwtAuthGuard)
  updateLocation(@Args('updateLocationInput') updateLocationInput: UpdateLocationInput, @User() currentUser: Account) {
    return this.locationsService.update(updateLocationInput, currentUser);
  }


  @Query(() => [Location], { name: 'locations'})
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.locationsService.findAll();
  }

}
