import { CanActivate, ExecutionContext, Inject, Injectable, Logger, OnModuleInit, UnauthorizedException } from "@nestjs/common";
import { catchError, map, Observable, of, tap } from "rxjs";
import { ClientGrpc } from "@nestjs/microservices";
import { Reflector } from "@nestjs/core";
import { AUTH_PACKAGE_NAME, AUTH_SERVICE_NAME, AuthServiceClient } from "../types";

export {}

@Injectable()
export class JwtAuthGuard implements CanActivate, OnModuleInit {
    private readonly logger = new Logger(JwtAuthGuard.name)
    private authService: AuthServiceClient

    constructor(
        @Inject(AUTH_SERVICE_NAME) private readonly client: ClientGrpc, 
        private readonly reflector: Reflector
    ) { }

    onModuleInit() {
        this.authService = this.client.getService<AuthServiceClient>(AUTH_PACKAGE_NAME)
    }

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const jwt = context.switchToHttp().getRequest().cookies?.Authentication || context.switchToHttp().getRequest().headers?.authentication;
        if (!jwt) return false;

        const roles = this.reflector.get<string[]>("roles", context.getHandler()) ?? []

        return this.authService.authenticate({
            Authentication: jwt
        }).pipe(
            tap((res) => {
                if (roles.length > 0) {
                    const userRoles = new Set(res?.roles ?? [])
                    if (!roles.find((value) => userRoles.has(value))) {
                        this.logger.error(`User ${res.id} does not have valid roles.`)
                        throw new UnauthorizedException("User does not have valid roles.");
                    }
                }
                context.switchToHttp().getRequest().user = {
                    ...res,
                    _id: res.id
                };
            }),
            map(() => true),
            catchError((error) => {
                this.logger.error(error);
                return of(false);
            })
        )
    }
}