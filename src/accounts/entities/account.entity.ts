import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  JoinTable, JoinColumn
} from "typeorm";
import {Location} from "../../locations/entities/location.entity";
import {Field, ObjectType} from "@nestjs/graphql";
import {Activity} from "../../activities/entities/activity.entity";

@Entity()
@ObjectType()
export class Account extends BaseEntity{

  @PrimaryGeneratedColumn()
  @Field()
  id: number

  @Column({unique: true})
  @Field()
  username: string

  @Column({unique: true})
  @Field()
  email: string

  @Column()
  @Field()
  password: string

  @OneToMany(()=>Activity,(activity)=>activity.account)
  @JoinColumn()
  @Field(type => [Activity], {nullable: true})
  activities:Activity[]

  @OneToMany(type => Location, location => location.account)
  @JoinTable()
  @Field(type =>[Location], {nullable: true})
  locations: Location[];
}