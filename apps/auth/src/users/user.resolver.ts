import { UserDocument } from "@app/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dtos/create-user.dto";

@Resolver(() => UserDocument)
export class UserResolver {
    constructor(private readonly usersService: UsersService) { }

    @Mutation(() => UserDocument)
    createUser(
        @Args("createUserInput") createUserInput: CreateUserDto
    ) {
        return this.usersService.create(createUserInput);
    }

    @Query(() => [UserDocument], { name: "users" })
    findAll() {
        return this.usersService.findAll()
    }
}