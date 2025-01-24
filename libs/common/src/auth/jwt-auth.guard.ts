import { CanActivate, ExecutionContext, Inject, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { catchError, map, Observable, of, tap } from "rxjs";
import { AUTH_SERVICE } from "../constants";
import { ClientProxy } from "@nestjs/microservices";
import { UserDto } from "../dto";
import { Reflector } from "@nestjs/core";

export {}

@Injectable()
export class JwtAuthGuard implements CanActivate {
    private readonly logger = new Logger(JwtAuthGuard.name)

    constructor(
        @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy, 
        private readonly reflector: Reflector
    ) { }

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const jwt = context.switchToHttp().getRequest().cookies?.Authentication || context.switchToHttp().getRequest().headers?.authentication;
        if (!jwt) return false;

        const roles = this.reflector.get<string[]>("roles", context.getHandler()) ?? []

        return this.authClient.send<UserDto>("authenticate", {
            Authentication: jwt
        }).pipe(
            tap((res) => {
                if (roles.length > 0) {
                    const userRoles = new Set(res?.roles ?? [])
                    if (!roles.find((value) => userRoles.has(value))) {
                        this.logger.error(`User ${res._id} does not have valid roles.`)
                        throw new UnauthorizedException("User does not have valid roles.");
                    }
                }
                context.switchToHttp().getRequest().user = res;
            }),
            map(() => true),
            catchError((error) => {
                this.logger.error(error);
                return of(false);
            })
        )
    }
}