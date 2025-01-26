import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Payload, RpcException } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';
import { PaymentsServiceController, PaymentsServiceControllerMethods } from '@app/common';

@Controller()
@PaymentsServiceControllerMethods()
export class PaymentsController implements PaymentsServiceController{
  constructor(private readonly paymentsService: PaymentsService) {}

  @UsePipes(new ValidationPipe({ exceptionFactory: (errors) => new RpcException(errors) }))
  async createCharge(
    data: PaymentsCreateChargeDto,
  ) {
    return this.paymentsService.createCharge(data)
  }
}
