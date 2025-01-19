import { Controller, Get } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateChargeDto } from '@app/common';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern("create_charge")
  async createCharge(
    @Payload() data: CreateChargeDto,
  ) {
    console.log(data)
    return this.paymentsService.createCharge(data.card, data.amount)
  }
}
