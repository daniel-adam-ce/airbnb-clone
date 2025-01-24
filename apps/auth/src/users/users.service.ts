import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { CreateUser } from './dtos/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from "bcryptjs";
import { GetUser } from './dtos/get-user.dto';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) { }

    async create(createUser: CreateUser) {
        await this.validateCreateUser(createUser)
        return this.usersRepository.create({
            ...createUser,
            password: await bcrypt.hash(createUser.password, 10)
        })
    }

    private async validateCreateUser(createUser: CreateUser) {
        try {
            await this.usersRepository.findOne({email: createUser.email});
        } catch (error) {
            // valid if error
            return;
        }

        throw new UnprocessableEntityException("Email already exists");
    }

    async verifyUser(email: string, password: string) {
        const user = await this.usersRepository.findOne({ email });
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            throw new UnauthorizedException("Credentials are not valid.");
        }

        return user;
    }

    async getUser(getUser: GetUser) {
        return this.usersRepository.findOne(getUser);
    }
}
