import { Controller } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotfiyEmailDto } from './dto/notify-email.dto';
import { NotificationsServiceController, NotificationsServiceControllerMethods } from '@app/common';


@Controller()
@NotificationsServiceControllerMethods()
export class NotificationsController implements NotificationsServiceController{
  constructor(private readonly notificationsService: NotificationsService) {}


  // @UsePipes(new ValidationPipe({exceptionFactory: (errors) => new RpcException(errors)}))
  // @EventPattern("notify_email")
  async notifyEmail(data: NotfiyEmailDto) {
    return this.notificationsService.notifyEmail(data);
  }
}
