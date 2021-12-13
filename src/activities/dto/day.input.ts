import { InputType,Field } from '@nestjs/graphql';
import {IsNotEmpty} from "class-validator";

@InputType()
export class dayInput {
    @IsNotEmpty()
    @Field()
    day: string
}
