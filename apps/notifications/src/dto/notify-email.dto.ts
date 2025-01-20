import { IsEmail } from "class-validator";

export class NotfiyEmailDto {
    @IsEmail()
    email: string
}