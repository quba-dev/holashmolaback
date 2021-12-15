import {Field, InputType} from "@nestjs/graphql";
import {IsNotEmpty} from "class-validator";

@InputType()
export class changePasswordInput{
    @IsNotEmpty()
    @Field()
    old_password: string;

    @IsNotEmpty()
    @Field()
    new_password: string;

    @IsNotEmpty()
    @Field()
    confirm_password: string;

}