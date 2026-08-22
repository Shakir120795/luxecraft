import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CartModule } from '../cart/cart.module';
import { AddressesModule } from '../addresses/addresses.module';
import { ShippingModule } from '../shipping/shipping.module';
import { TaxModule } from '../tax/tax.module';
import { OrdersModule } from '../orders/orders.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [CartModule, AddressesModule, ShippingModule, TaxModule, OrdersModule, PaymentsModule],
  providers: [CheckoutService],
  exports: [CheckoutService],
})
export class CheckoutModule {}
