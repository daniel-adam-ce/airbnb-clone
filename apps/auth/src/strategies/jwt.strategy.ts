import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../users/users.service";
import { Request } from "express";
import { TokenPayload } from "../interfaces/token-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService,
        private readonly usersService: UsersService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: any) => {
                    return request?.cookies?.Authentication 
                    || request?.Authentication
                    || request?.headers?.Authentication
                }
            ]),
            secretOrKey: configService.get("JWT_SECRET"),
            passReqToCallback: true
        })
    }

    // passReqToCallback is required if jwtFromRequest is present,
    // it passes three args (request, jwt_payload, done_callback)
    validate(...args: [Request, TokenPayload, Function]) {
        const jwtPayload = args[1];
        return this.usersService.getUser({id: jwtPayload.userId})
    }
}