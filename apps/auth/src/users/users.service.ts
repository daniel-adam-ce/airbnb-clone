import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from "bcryptjs";
import { GetUserDto } from './dtos/get-user.dto';
import { Role, User } from '@app/common';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) { }

    async create(createUserDto: CreateUserDto) {
        await this.validateCreateUser(createUserDto)
        const user = new User({
            ...createUserDto,
            password: await bcrypt.hash(createUserDto.password, 10),
            roles: createUserDto.roles?.map((roleDto) => new Role(roleDto))
        })
        return this.usersRepository.create(user)
    }

    private async validateCreateUser(createUserDto: CreateUserDto) {
        try {
            await this.usersRepository.findOne({email: createUserDto.email});
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

    async getUser(getUserDto: GetUserDto) {
        return this.usersRepository.findOne(getUserDto, { roles: true });
    }
}
