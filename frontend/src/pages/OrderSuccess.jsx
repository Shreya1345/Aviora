import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';

const OrderSuccess = () => {
  const { state } = useLocation();
  const isTestOrder = state?.paymentProvider === 'test';
  const isCodOrder = state?.paymentProvider === 'cod';
  const confirmationMessage = state?.message || (
    isTestOrder
      ? 'Your test order was created successfully in test mode.'
      : isCodOrder
        ? 'Your order has been placed. Please pay cash when it is delivered.'
      : 'Thank you for choosing Aviora. Your payment was received securely and your handcrafted piece will be prepared for insured shipment shortly.'
  );

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8 sm:py-16 sm:px-6">
      <div className="card rounded-2xl sm:rounded-3xl border border-base-300 bg-base-100 p-6 text-center shadow-lg sm:p-12">
        <div className="mx-auto mb-5 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-success/15 text-success">
          <Icon icon="mdi:check-circle" width="48" aria-hidden="true" />
        </div>

        <span className="badge badge-secondary mb-3 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
          {isTestOrder ? 'Test Order Placed' : isCodOrder ? 'Order Placed · Cash on Delivery' : 'Payment Confirmed'}
        </span>

        <h1 className="mb-3 text-2xl font-bold sm:text-4xl text-base-content" style={{ fontFamily: "'Playfair Display', serif" }}>
          {isTestOrder || isCodOrder ? 'Order Placed!' : 'Thank You For Your Order'}
        </h1>

        <p className="mb-8 text-base leading-relaxed text-base-content/75">
          {confirmationMessage}
        </p>

        {state?.orderId && (
          <div className="mb-8 rounded-xl bg-base-200/70 p-4 text-xs text-base-content/70">
            <span className="font-semibold text-base-content">Order Reference:</span>{' '}
            <span className="font-mono">{state.orderId}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/shop"
            className="btn btn-primary w-full sm:w-auto text-white shadow-md"
          >
            <Icon icon="mdi:storefront-outline" aria-hidden="true" /> Continue Shopping
          </Link>
          <Link
            to="/profile"
            className="btn btn-outline w-full sm:w-auto"
          >
            <Icon icon="mdi:package-variant-closed" aria-hidden="true" /> View Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
