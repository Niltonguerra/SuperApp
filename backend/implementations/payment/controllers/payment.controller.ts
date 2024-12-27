import { Controller, Post, Body, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Stripe } from 'stripe';
import { CriarPagamentoDto } from '../dtos/Payment.dto';
import { PaymentService } from '../services/payment.service';


@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService
  ) {}

  @Post('create-payment-intent')
  async createPaymentIntent(@Body() body: CriarPagamentoDto) {
    try {
      const paymentIntent = await this.paymentService.createPaymentIntent(body.amount,body.currency);
      return {clientSecret: paymentIntent.client_secret};
    } catch (error) {
      if (error instanceof Stripe.errors.StripeCardError) {
        throw new HttpException({ message: error.message }, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException({ message: 'Internal Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
