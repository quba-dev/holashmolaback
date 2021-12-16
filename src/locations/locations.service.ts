import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { CreateLocationInput } from './dto/create-location.input';
import { UpdateLocationInput } from './dto/update-location.input';
import {InjectRepository} from "@nestjs/typeorm";
import {Location} from "./entities/location.entity";
import {Repository, In, getRepository} from "typeorm";
import {JwtService} from "@nestjs/jwt";
import {Activity} from "../activities/entities/activity.entity";

@Injectable()
export class LocationsService {
  constructor(
      @InjectRepository(Location)
      private readonly locationService: Repository<Location>,
      private readonly jwtService: JwtService) {
  }

  async createLocation(dto: CreateLocationInput, token) {
    const location = new Location()
    const currentUser = this.jwtService.verify(token)

    Object.assign(location, dto)
    location.account = currentUser
    return this.locationService.save(location)
  }

  async update(dto: UpdateLocationInput,currentUser) {
    const location = await this.locationService.findOne({id: dto.id})

    const user = this.jwtService.verify(currentUser)
    if (!location) {
        throw new HttpException('Location does not exist', HttpStatus.NOT_FOUND)
    }

    if (location.account.email !== user.email){
        throw new HttpException('You are not author', HttpStatus.FORBIDDEN)
    }
    Object.assign(location, dto)
    await this.locationService.save(location)
    return location
  }



  async remove(id: number, currentUser) {
    const location = await this.locationService.findOne(id)
    const user = this.jwtService.verify(currentUser)

    if (!location) {
        throw new HttpException('location does not exist', HttpStatus.NOT_FOUND)
    }
    if (location.account.email !== user.email){
        throw new HttpException('You are not author', HttpStatus.FORBIDDEN)
    }

    if (location.activities) {
      throw new HttpException('Location has activities, first you should delete activities.', HttpStatus.NOT_FOUND)
    }

    await this.locationService.delete(id)
    return location
  }

  async findById(id){
    return this.locationService.findOne(id)
  }
  async find(ids) { // (ids: [number])
    return this.locationService.find({
      where: {id: In(ids)}
    })
  }

  async findByLocationAndTime(id: number, day: Date) {
    const locationById = await this.locationService.findOne(id, {relations: ["activities"]})
    if (!locationById) {
      throw new HttpException('there is no such location', HttpStatus.NOT_FOUND)
    }

    const currentActivity = locationById.activities
    // let entry = currentActivity.map((activity) => activity.day.toLocaleDateString());
    let data = []
    for (let x of currentActivity){
      data.push((x.day).toLocaleDateString())
      // if (day == x) {
      //   throw new HttpException('на этот день занято', HttpStatus.NOT_FOUND)
      // }
    }

    for (let x of data ){
      if ((day.toLocaleDateString()).toString() == x){
        throw new HttpException('на этот день занято', HttpStatus.NOT_FOUND)
      }
    }
    return new HttpException('Created', HttpStatus.OK)
  }

  async findAll(){
    return this.locationService.find()
  }

  async findAllLocationByUser(token){
    const currentUser = await this.jwtService.verify(token)
    console.log(currentUser.id)
    const locationsList = await getRepository(Location)
        .createQueryBuilder('locations')
        .where("locations.account.id = :id", {id: currentUser.id})
        .getMany()
    const userLocations = locationsList.map((location) => location.id)
    return this.find(userLocations)
  }
}
