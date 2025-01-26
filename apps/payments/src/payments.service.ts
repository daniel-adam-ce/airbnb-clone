import { NOTIFICATIONS_SERVICE_NAME, NotificationsServiceClient } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc } from '@nestjs/microservices';
import Stripe from 'stripe';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {
private notificationsService: NotificationsServiceClient

  private readonly stripe = new Stripe(this.configSerivce.get("STRIPE_SECRET_KEY"),
    {
      apiVersion: "2024-12-18.acacia"
    }
  )

  constructor(
    private readonly configSerivce: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE_NAME) private readonly client: ClientGrpc
  ) { }

  async createCharge({ card, amount, email }: PaymentsCreateChargeDto) {

    const paymentMethod = await this.stripe.paymentMethods.create({
      type: "card",
      card: {
        token: "tok_mastercard"
      }
    })

    const paymentIntent = await this.stripe.paymentIntents.create({
      payment_method: paymentMethod.id,
      amount: amount * 100,
      confirm: true,
      payment_method_types: ["card"],
      currency: "usd"
    })

    if (!this.notificationsService) {
      this.notificationsService = this.client.getService<NotificationsServiceClient>(NOTIFICATIONS_SERVICE_NAME);
    }

    this.notificationsService.notifyEmail({
      email: email,
      text: `Payment of $${amount} processed successfully.`
    }).subscribe(() => {})

    return paymentIntent;
  }
}
