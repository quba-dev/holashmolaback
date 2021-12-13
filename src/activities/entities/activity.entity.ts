import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  JoinColumn,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  BeforeUpdate,
} from 'typeorm';
import {Account} from "../../accounts/entities/account.entity";
import {Location} from "../../locations/entities/location.entity";



@Entity()
@ObjectType()
export class Activity {
  @PrimaryGeneratedColumn()
  @Field(() => Int, )
  id: number

  @Column()
  @Field()
  day: Date

  @Column()
  @Field()
  name:string

  @Column()
  @Field()
  description:string

  @ManyToOne(type=>Location,location=>location.activities,{eager:true})
  @JoinColumn()
  @Field(type => Location)
  location:Location

  @ManyToOne(()=>Account,account=>account=>account.activities,{eager:true})
  @JoinColumn()
  @Field(type=>Account)
  account:Account
}