import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from './users/current-user.decorator';
import { UserDocument } from './users/schema/users.schema';
import { Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { MessagePattern } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response
  ) {
    await this.authService.login(user, response);
    response.send(user)
  }

  @UseGuards(AuthGuard)
  @MessagePattern("authenticate")
  async authenticate() {
    
  }
}
