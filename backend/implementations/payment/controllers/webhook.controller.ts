import { Body, Controller, Post, Res, HttpStatus, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Stripe } from 'stripe';


@Controller('webhook')
export class WebhookController {
    private stripe: Stripe;
    private endpointSecret: string;


    constructor(private configService: ConfigService) {
      this.stripe = new Stripe(this.configService.get<string>('SECRET_STRIPE_TEST') as string,
       {  apiVersion: '2024-09-30.acacia',});
      this.endpointSecret = 'whsec_2c082a41841e78880b54e2916323e43fbffaa688e2a80e84092093b9b221c725';
    }
    @Post()
    async handleWebhook(@Req() req: Request, @Res() res: Response, @Body() body: any) {
        const sig = req.headers['stripe-signature'];

        let event;

        try {
            event = this.stripe.webhooks.constructEvent(body, sig, this.endpointSecret);
        } catch (err) {
            console.log(`Webhook error: ${err.message}`);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        // Verifica se o evento é um pagamento bem-sucedido
        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object;
            console.log('Pagamento bem-sucedido!', paymentIntent);
        }

        res.status(HttpStatus.OK).json({ received: true });
    }
}