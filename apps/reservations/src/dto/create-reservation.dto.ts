import { Type } from "class-transformer";
import { IsDate, IsDefined, IsNotEmpty, ValidateNested } from "class-validator";
import { CreateChargeDto } from "@app/common";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateReservationDto {
    @IsDate()
    @Type(() => Date)
    @Field()
    startDate: Date;

    @IsDate()
    @Type(() => Date)
    @Field()
    endDate: Date;

    @ValidateNested()
    @IsDefined()
    @IsNotEmpty()
    @Type(() => CreateChargeDto)
    @Field(() => CreateChargeDto)
    charge: CreateChargeDto
}
