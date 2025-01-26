import { Type } from "class-transformer";
import { CardDto } from "./card.dto";
import { IsDefined, IsNotEmpty, IsNumber, ValidateNested } from "class-validator";
import { CreateChargeMessage } from "../types";

export class CreateChargeDto implements Omit<CreateChargeMessage, "email"> {
    @ValidateNested()
    @IsDefined()
    @IsNotEmpty()
    @Type(() => CardDto)
    card: CardDto;

    @IsNumber()
    amount: number;
}