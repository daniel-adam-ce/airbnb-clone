import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern("create_charge")
  @UsePipes(new ValidationPipe({ exceptionFactory: (errors) => new RpcException(errors) }))
  async createCharge(
    @Payload() data: PaymentsCreateChargeDto,
  ) {
    return this.paymentsService.createCharge(data)
  }
}
