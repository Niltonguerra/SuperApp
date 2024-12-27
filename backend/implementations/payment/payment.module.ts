import { Module } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { PaymentController } from './controllers/payment.controller';
import { PaymentService } from './services/payment.service';
import { WebhookController } from './controllers/webhook.controller';

@Module({
  controllers: [
    PaymentController,
    WebhookController
  ],
  providers: [
    PaymentService,
    ConfigService
  ],
  
})
export class PaymentModule {}