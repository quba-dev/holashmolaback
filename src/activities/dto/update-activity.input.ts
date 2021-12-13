import { CreateActivityInput } from './create-activity.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import {IsNotEmpty} from "class-validator";

@InputType()
export class UpdateActivityInput extends PartialType(CreateActivityInput) {
  @IsNotEmpty()
  @Field(() => Int)
  id: number;
  @IsNotEmpty()
  @Field()
  name:string
  @IsNotEmpty()
  @Field()
  description:string
  @IsNotEmpty()
  @Field()
  location: number
  @IsNotEmpty()
  @Field()
  day: string
}
