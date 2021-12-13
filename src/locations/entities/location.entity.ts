import { ObjectType, Field, Int } from '@nestjs/graphql';
import {Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Account} from "../../accounts/entities/account.entity";
import {Activity} from "../../activities/entities/activity.entity";


@Entity()
@ObjectType()
export class Location {

  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column()
  @Field()
  address: string

  @OneToMany(type=>Activity,activity=>activity.location)
  @JoinColumn()
  @Field(type => [Activity])
  activities:Activity[]

  @ManyToOne(type => Account, account => account.locations,{eager:true})
  @JoinTable()
  @Field(type => Account)
  account: Account;
}
