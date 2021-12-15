import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { CreateActivityInput } from './dto/create-activity.input';
import {InjectRepository} from "@nestjs/typeorm";
import {Activity} from "./entities/activity.entity";
import {getRepository, In, Repository} from "typeorm";
import {LocationsService} from "../locations/locations.service";
import {DateIntervalInput} from "./dto/dateInterval.input";
import {dayInput} from "./dto/day.input";
import {JwtService} from "@nestjs/jwt";
import {Location} from "../locations/entities/location.entity";
import {AccountsService} from "../accounts/accounts.service";


@Injectable()
export class ActivitiesService{

  constructor(
      @InjectRepository(Activity)
      private readonly activityRepository: Repository<Activity>,
      private locationService: LocationsService,
      private accountService: AccountsService,
      private readonly jwtService: JwtService
  ) {
  }


  async create(dto: CreateActivityInput, token) {
    const activity = new Activity()
    const day = new Date(dto.day)
    const location = await this.locationService.findById(dto.location)
    await this.locationService.findByLocationAndTime(dto.location, day)
    const currentUser = await this.jwtService.verify(token)
    Object.assign(activity, dto ) // {account: currentUser, location}
    activity.account = currentUser
    activity.location = location
    return this.activityRepository.save({...activity, day: day})
  }

  async createActivity(activityDto: CreateActivityInput, currentUser) {
    return this.create(activityDto, currentUser);
  }

  async findActivityAvailable(dto: DateIntervalInput){
    const listOfDates = await this.enumerateDaysBetweenDates(dto.startDay, dto.endDay)
    const data = await this.activityRepository.find({where:{day: In(listOfDates)}})
    return [...data]
  }

  async enumerateDaysBetweenDates(start, end){
    const arr = [];
    const dt = new Date(start);
    const ends = new Date(end);
    while (dt <= ends) {
      arr.push((new Date(dt)));
      dt.setDate(dt.getDate() + 1);
    }
    return arr
  }

  async availableLocationByDate(dto: dayInput){
    const newDate = new Date(dto.day)
    const dataActivities = await this.activityRepository.find({where:{day: newDate}})
    if (dataActivities.length === 0){ // ( !dataActivities.length)
      return this.locationService.findAll()
    }
    const excludesData = dataActivities.map((activity) => activity.location.id);
    const data = await getRepository(Location)
        .createQueryBuilder('location')
        .where("location.id NOT IN (:...id)", { id: excludesData})
        .getMany()

    return data
  }

  async remove(id, currentUser){
    const activity = await this.activityRepository.findOne({id})
    const user = this.jwtService.verify(currentUser)

    if (!activity) {
      throw new HttpException('Activity does not exist', HttpStatus.NOT_FOUND)
    }
    if (activity.account.email !== user.email){
      throw new HttpException('You are not author', HttpStatus.FORBIDDEN)
    }
    await this.activityRepository.delete(id)
    return activity;
  }

  async update(dto, currentUser){
    const activity = await this.activityRepository.findOne({id: dto.id})
    const user = this.jwtService.verify(currentUser)
    if (!activity) {
      throw new HttpException('activity does not exist', HttpStatus.NOT_FOUND)
    }

    if (activity.account.email !== user.email){
      throw new HttpException('You are not author', HttpStatus.FORBIDDEN)
    }
    Object.assign(activity, dto)
    await this.activityRepository.save(activity)
    return this.activityRepository.findOne({id: activity.id})
  }


  async findByLocation(id: number) {
    const locationById = await this.locationService.findById(id);
    if ( !locationById) {
      throw new HttpException('there is no such location', HttpStatus.NOT_FOUND)
    }

    const activitiesList = await getRepository(Activity)
        .createQueryBuilder('activities')
        .where("activities.location.id = :id", {id: locationById.id})
        .getMany()

    if (activitiesList.length === 0) { // ( !activitiesList.length)
      throw new HttpException('У этой локации нет мероприятий', HttpStatus.NOT_FOUND)
    }

    const entry = activitiesList.map((activity) => activity.id)
    const activities = await this.find(entry)

    return [...activities]
  }

  async find(ids){ // (ids: number[])
    return this.activityRepository.find({where:{id: In(ids)}})
  }

  async findAllActivityByUser(token){
    const currentUser = await this.jwtService.verify(token)
    const activitiesList = await getRepository(Activity)
        .createQueryBuilder('activities')
        .where("activities.account.id = :id", {id: currentUser.id})
        .getMany()
    const usersActivities = activitiesList.map((activity) => activity.id)
    return this.find(usersActivities)
  }

  async findActivity(id){
    return this.activityRepository.findOne({id})
  }

  // async findInfo(user){
  //   const currentUser = await this.accountService.profile(user)
  //   const activities = await this.findAllActivityByUser(user)
  //   const locations = await this.locationService.findAllLocationByUser(user)
  //   return {
  //     ...currentUser,
  //     activities,
  //     locations
  //   }
  // }
}
