import { IsEmail, IsString } from "class-validator";

export class NotfiyEmailDto {
    @IsEmail()
    email: string

    @IsString()
    text: string
}