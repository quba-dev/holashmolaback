import {Field, InputType} from "@nestjs/graphql";

@InputType()
export class changePasswordInput{
    @Field()
    old_password: string;

    @Field()
    new_password: string;

    @Field()
    confirm_password: string;

}