import { InputType,Field } from '@nestjs/graphql';
import {IsNotEmpty} from "class-validator";

@InputType()
export class DateIntervalInput {
    @IsNotEmpty()
    @Field()
    startDay: string

    @IsNotEmpty()
    @Field()
    endDay: string

}
