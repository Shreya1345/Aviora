import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, addToCart } from '../redux/cartSlice';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import CartSummary from '../components/CartSummary';
import { formatCurrency } from '../utils/formatCurrency';

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
    toast.success('Piece removed from your bag.');
  };

  const handleUpdateQty = (item, value) => {
    const qty = Number(value);
    if (Number.isInteger(qty) && qty > 0) {
      dispatch(addToCart({ ...item, qty }));
    }
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-8 border-b border-base-300 pb-4">
        <span className="badge badge-secondary mb-2 px-3 py-1">Review Order</span>
        <h1 className="text-3xl font-bold sm:text-4xl" style={{ fontFamily: "'Playfair Display', serif" }}>
          Your Shopping Bag
        </h1>
        <p className="mt-1 text-sm text-base-content/65">
          {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your luxury selection
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="card items-center rounded-3xl border border-base-300 bg-base-100 p-12 text-center shadow-sm">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-secondary/10">
            <Icon icon="mdi:shopping-outline" width="40" className="text-secondary" aria-hidden="true" />
          </div>
          <h3 className="mb-2 text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            Your bag is empty
          </h3>
          <p className="mb-6 max-w-md text-base-content/65">
            Discover our handcrafted collections of diamond rings, gold necklaces, and fine gemstones.
          </p>
          <Link
            to="/shop"
            className="btn btn-primary inline-flex items-center gap-2 shadow-md"
            style={{ background: 'linear-gradient(135deg, #b76e79, #c9956b)' }}
          >
            <Icon icon="mdi:storefront-outline" aria-hidden="true" /> Explore Collections
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {cartItems.map((item) => (
              <article
                key={item.productId}
                className="grid grid-cols-[4fr_1fr_auto] items-center gap-4 border-b border-base-300 py-4 text-base-content/80 sm:grid-cols-[4fr_1.5fr_auto]"
              >
                <div className="flex items-start gap-4 sm:gap-6">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-16 w-16 rounded-lg object-cover sm:h-20 sm:w-20"
                  />
                  <div>
                    <h3 className="text-sm font-bold sm:text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {item.name}
                    </h3>
                    <p className="mt-2 font-semibold text-secondary">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                </div>
                <input
                  type="number"
                  min="1"
                  step="1"
                  aria-label={`Quantity for ${item.name}`}
                  value={item.qty}
                  onChange={(event) => handleUpdateQty(item, event.target.value)}
                  className="input input-bordered input-sm w-16"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(item.productId)}
                  className="btn btn-ghost btn-sm text-error"
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <Icon icon="mdi:trash-can-outline" aria-hidden="true" />
                </button>
              </article>
            ))}
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-4">
              <CartSummary totalAmount={totalPrice} />
              <button
                onClick={() => navigate('/checkout')}
                className="btn btn-primary btn-lg w-full shadow-lg"
                style={{ background: 'linear-gradient(135deg, #b76e79, #c9956b)' }}
              >
                Proceed to Checkout <Icon icon="mdi:arrow-right" aria-hidden="true" />
              </button>
              <div className="space-y-2 border-t border-base-300 pt-4 text-xs text-base-content/65">
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:shield-check-outline" className="text-base text-primary" />
                  <span>Safe &amp; Encrypted 256-bit Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:refresh" className="text-base text-primary" />
                  <span>30-Day Easy Returns Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
