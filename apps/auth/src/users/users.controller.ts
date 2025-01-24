import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser, User } from '@app/common';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    async createUser(@Body() body: CreateUserDto) {
        return this.usersService.create(body)
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getUser(
        @CurrentUser() user: User
    ) {
        return user;
    }
}
