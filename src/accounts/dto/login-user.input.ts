import {Field, InputType} from "@nestjs/graphql";
import {IsNotEmpty} from "class-validator";


@InputType()
export class LoginUserInput {

    @IsNotEmpty()
    @Field()
    email: string;

    @IsNotEmpty()
    @Field()
    password: string;
}