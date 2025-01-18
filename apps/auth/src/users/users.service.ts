import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) { }

    async create(createUserDto: CreateUserDto) {
        return this.usersRepository.create({
            ...createUserDto,
            password: await bcrypt.hash(createUserDto.password, 10)
        })
    }

    async verifyUser(email: string, password: string) {
        const user = await this.usersRepository.findOne({ email });
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            throw new UnauthorizedException("Credentials are not valid.");
        }

        return user;
    }
}
