import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EventPattern, Payload, RpcException } from '@nestjs/microservices';
import { NotfiyEmailDto } from './dto/notify-email.dto';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UsePipes(new ValidationPipe({exceptionFactory: (errors) => new RpcException(errors)}))
  @EventPattern("notify_email")
  async notifyEmail(@Payload() data: NotfiyEmailDto) {
    return this.notificationsService.notifyEmail(data);
  }
}
