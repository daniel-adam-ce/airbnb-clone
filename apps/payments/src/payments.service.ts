import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {

  private readonly stripe = new Stripe(this.configSerivce.get("STRIPE_SECRET_KEY"),
    {
      apiVersion: "2024-12-18.acacia"
    }
  )

  constructor(private readonly configSerivce: ConfigService) { }

  async createCharge(
    card: Stripe.PaymentMethodCreateParams.Card,
    amount: number
  ) {
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: "card",
      card: card
    })

    const paymentIntent = await this.stripe.paymentIntents.create({
      payment_method: paymentMethod.id,
      amount: amount * 100,
      confirm: true,
      payment_method_types: ["card"],
      currency: "usd"
    })

    return paymentIntent;
  }
}
