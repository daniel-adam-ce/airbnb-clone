import { Injectable } from '@nestjs/common';
import { NotfiyEmailDto } from './dto/notify-email.dto';

@Injectable()
export class NotificationsService {
  async notifyEmail({ email }: NotfiyEmailDto) {
    console.log(email);
  }
}
