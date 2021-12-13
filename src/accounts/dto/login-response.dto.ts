import {Field, ObjectType} from "@nestjs/graphql";
import {Account} from "../entities/account.entity";



@ObjectType()
export class LoginResponse {
    @Field()
    access_token: string;

    @Field()
    userId: number;

}