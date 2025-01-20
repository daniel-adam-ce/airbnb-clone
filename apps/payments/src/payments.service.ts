import { NOTIFICATIONS_SERVICE } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import Stripe from 'stripe';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {

  private readonly stripe = new Stripe(this.configSerivce.get("STRIPE_SECRET_KEY"),
    {
      apiVersion: "2024-12-18.acacia"
    }
  )

  constructor(
    private readonly configSerivce: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE) private readonly notificationsService: ClientProxy
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

    this.notificationsService.emit("notify_email", {
      email: email,
      text: `Payment of $${amount} processed successfully.`
    })

    return paymentIntent;
  }
}
