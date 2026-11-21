import { formatCurrency } from '../utils/formatCurrency';

const CartSummary = ({ totalAmount }) => (
  <section className="card border border-base-300 bg-base-100 shadow-sm">
    <div className="card-body p-5">
      <h3 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
        Cart Totals
      </h3>
      <div className="mt-2 space-y-3 text-sm text-base-content/80">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(totalAmount, 'USD')}</span>
        </div>
        <div className="flex justify-between">
          <span>Insured Shipping</span>
          <span className="text-success">FREE</span>
        </div>
        <div className="flex justify-between">
          <span>Luxury Velvet Packaging</span>
          <span className="text-success">Complimentary</span>
        </div>
      </div>
      <div className="mt-2 border-t border-base-300 pt-4">
        <div className="flex items-baseline justify-between">
          <span className="font-semibold">Total</span>
          <span className="text-2xl font-bold text-secondary">
            {formatCurrency(totalAmount, 'USD')}
          </span>
        </div>
        <p className="mt-1 text-xs text-base-content/60">Inclusive of all taxes &amp; duties</p>
      </div>
    </div>
  </section>
);

export default CartSummary;
