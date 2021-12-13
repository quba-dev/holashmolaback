import { InputType,Field } from '@nestjs/graphql';
import {IsNotEmpty} from "class-validator";

@InputType()
export class CreateActivityInput {

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
