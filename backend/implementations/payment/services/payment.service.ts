import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import Stripe from 'stripe';


@Injectable()
export class PaymentService {
  
  private stripe: Stripe;


  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get<string>('SECRET_STRIPE_TEST') as string, {
      apiVersion: '2024-09-30.acacia', // Use a versão mais recente da API do Stripe
    });
  }

  async createPaymentIntent(amount: number, currency: string) {
    return await this.stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['card'],
    });
  }

}
