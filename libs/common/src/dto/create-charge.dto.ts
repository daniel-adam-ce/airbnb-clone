import { Type } from "class-transformer";
import { CardDto } from "./card.dto";
import { IsDefined, IsNotEmpty, IsNumber, ValidateNested } from "class-validator";

export class CreateChargeDto {
    @ValidateNested()
    @IsDefined()
    @IsNotEmpty()
    @Type(() => CardDto)
    card: CardDto;

    @IsNumber()
    amount: number;
}