import { InputType, Int, Field } from '@nestjs/graphql';
import {IsNotEmpty} from "class-validator";

@InputType()
export class CreateUserInput {
  @IsNotEmpty()
  @Field()
  email: string;

  @IsNotEmpty()
  @Field()
  username: string;

  @IsNotEmpty()
  @Field()
  password: string;
}
