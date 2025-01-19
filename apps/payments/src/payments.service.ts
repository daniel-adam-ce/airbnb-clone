import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {

  private readonly = new Stripe(this.configSerivce.get("STRIPE_SECRET_KEY"),
    {
      apiVersion: "2024-12-18.acacia"
    }
  )

  constructor(private readonly configSerivce: ConfigService) { }

  getHello(): string {
    return 'Hello World!';
  }
}
