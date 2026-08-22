import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { CartService } from '../cart/cart.service';
import { AddressesService } from '../addresses/addresses.service';
import { ShippingService } from '../shipping/shipping.service';
import { TaxService } from '../tax/tax.service';
import { OrdersService } from '../orders/orders.service';
import { PaymentsService } from '../payments/payments.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CheckoutService {
  private readonly logger = new Logger(CheckoutService.name);

  constructor(
    private readonly cart: CartService,
    private readonly addresses: AddressesService,
    private readonly shipping: ShippingService,
    private readonly tax: TaxService,
    private readonly orders: OrdersService,
    private readonly payments: PaymentsService,
    private readonly prisma: PrismaService,
  ) {}

  async initiateCheckout(userId?: string, sessionId?: string): Promise<any> {
    const cart = await this.cart.getCart(userId, sessionId);
    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty.');
    }

    const totals = await this.cart.calculateCartTotals(userId, sessionId);

    return {
      cart,
      totals,
      cartTotal: totals.subtotal,
      currency: cart.currency,
      nextStep: userId ? 'select_address' : 'guest_email',
    };
  }

  async calculateCheckoutTotals(data: {
    subtotal: number;
    shippingCost: number;
    country: string;
    stateProvince?: string;
    currency: string;
  }): Promise<any> {
    const taxCalc = await this.tax.calculateTax({
      country: data.country,
      stateProvince: data.stateProvince,
      amount: data.subtotal + data.shippingCost,
    });

    const total = data.subtotal + data.shippingCost + taxCalc.taxAmount;

    return {
      subtotal: data.subtotal,
      shippingCost: data.shippingCost,
      taxAmount: taxCalc.taxAmount,
      taxRate: taxCalc.taxRate,
      total,
      currency: data.currency,
    };
  }

  async createOrderFromCheckout(data: {
    userId?: string;
    guestEmail?: string;
    addressId: string;
    shippingMethodId: string;
    cartItems: any[];
    shippingCost: number;
    taxAmount: number;
    subtotal: number;
    total: number;
    currency: string;
  }): Promise<any> {
    // Get address
    let shippingAddress, billingAddress;
    if (data.userId) {
      shippingAddress = await this.addresses.findOne(data.addressId, data.userId);
    } else {
      throw new BadRequestException('Guest checkout address handling deferred to Phase 6.');
    }

    billingAddress = shippingAddress; // Use same as shipping for now

    // Get shipping method details
    const shippingMethod = await this.prisma.shippingMethod.findUnique({
      where: { id: data.shippingMethodId },
    });
    if (!shippingMethod) throw new BadRequestException('Invalid shipping method.');

    // Create order
    const order = await this.orders.create({
      userId: data.userId,
      guestEmail: data.guestEmail,
      orderType: 'STANDARD',
      cart: { items: data.cartItems },
      shippingAddress,
      billingAddress,
      shippingMethodId: data.shippingMethodId,
      shippingMethodName: shippingMethod.name,
      shippingCost: data.shippingCost,
      taxAmount: data.taxAmount,
      subtotal: data.subtotal,
      total: data.total,
      currency: data.currency,
    });

    // Create payment record
    const payment = await this.payments.create({
      orderId: order.id,
      provider: 'pending', // Will be set by payment provider integration
      amount: data.total,
      currency: data.currency,
      metadata: { orderNumber: order.orderNumber },
    });

    return { order, payment };
  }
}
