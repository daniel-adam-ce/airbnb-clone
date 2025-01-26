import { Type } from "class-transformer";
import { CardDto } from "./card.dto";
import { IsDefined, IsNotEmpty, IsNumber, ValidateNested } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateChargeDto {
    @ValidateNested()
    @IsDefined()
    @IsNotEmpty()
    @Type(() => CardDto)
    @Field(() => CardDto)
    card: CardDto;

    @IsNumber()
    @Field()
    amount: number;
}