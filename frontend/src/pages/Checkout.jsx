import { useContext, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth-context';
import { clearCart } from '../redux/cartSlice';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import CartSummary from '../components/CartSummary';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const formRef = useRef(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('new');
  const [loadingAddresses, setLoadingAddresses] = useState(Boolean(user));
  const [address, setAddress] = useState({
    firstName: '', lastName: '', email: user?.email || '', street: '',
    city: '', state: '', zipcode: '', country: '', phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [placingOrder, setPlacingOrder] = useState(false);

  const getShippingAddress = (formData) => ({
    fullName: `${formData.firstName} ${formData.lastName}`.trim(),
    email: (formData.email || user?.email || '').trim(),
    street: formData.street.trim(),
    city: formData.city.trim(),
    state: formData.state.trim(),
    postalCode: formData.zipcode.trim(),
    country: formData.country.trim(),
    phone: formData.phone.trim()
  });

  useEffect(() => {
    if (!user) return;

    let active = true;
    const fetchAddresses = async () => {
      try {
        const res = await fetch('/api/auth/addresses', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Unable to load saved addresses.');
        if (!active) return;

        const addresses = Array.isArray(data) ? data : [];
        setSavedAddresses(addresses);
        if (addresses.length > 0) {
          const mostRecentAddress = addresses[addresses.length - 1];
          const [firstName, ...lastName] = mostRecentAddress.fullName.trim().split(/\s+/);
          setAddress({
            firstName,
            lastName: lastName.join(' '),
            email: mostRecentAddress.email || user.email || '',
            street: mostRecentAddress.street,
            city: mostRecentAddress.city,
            state: mostRecentAddress.state || '',
            zipcode: mostRecentAddress.postalCode,
            country: mostRecentAddress.country,
            phone: mostRecentAddress.phone || ''
          });
          setSelectedAddressId(String(mostRecentAddress._id));
        }
      } catch (error) {
        if (active) {
          console.error(error);
          toast.error(error.message || 'Unable to load saved addresses.');
        }
      } finally {
        if (active) setLoadingAddresses(false);
      }
    };

    fetchAddresses();
    return () => {
      active = false;
    };
  }, [user]);

  useEffect(() => {
    if (new URLSearchParams(location.search).get('payment') === 'cancelled') {
      toast.info('Stripe checkout was cancelled. No payment was completed.');
      navigate('/checkout', { replace: true });
    }
  }, [location.search, navigate]);

  const finishOrder = async (orderData, provider) => {
    const placedOrder = orderData.order || orderData;
    let addressSaved = true;
    if (selectedAddressId === 'new') {
      try {
        const addressRes = await fetch('/api/auth/addresses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify(getShippingAddress(address))
        });
        const addressData = await addressRes.json();
        if (!addressRes.ok) throw new Error(addressData.message || 'Unable to save address.');
        setSavedAddresses((currentAddresses) => (
          currentAddresses.some((savedAddress) => String(savedAddress._id) === String(addressData.address._id))
            ? currentAddresses
            : [...currentAddresses, addressData.address]
        ));
      } catch (error) {
        addressSaved = false;
        console.error('Order was placed, but the address could not be saved:', error);
      }
    }

    try {
      const cartRes = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (!cartRes.ok) console.error('Order was placed, but the server cart could not be cleared.');
    } catch (error) {
      console.error('Order was placed, but the server cart could not be cleared:', error);
    }
    dispatch(clearCart());
    if (addressSaved) toast.success('Order placed successfully.');
    else toast.warning('Order placed, but this address could not be saved for future checkouts.');
    navigate('/ordersuccess', {
      state: {
        message: orderData.message || 'Order placed. Please pay cash on delivery.',
        orderId: placedOrder._id,
        paymentProvider: provider
      }
    });
  };

  const openRazorpayCheckout = (orderData) => {
    if (typeof window.Razorpay !== 'function') {
      throw new Error('Razorpay Checkout did not load. Refresh the page and try again.');
    }
    if (
      orderData.currency !== 'INR'
      || !Number.isInteger(orderData.amount)
      || !Number.isFinite(orderData.exchangeRate)
      || typeof orderData.exchangeRateDate !== 'string'
    ) {
      throw new Error('Razorpay did not return a valid INR order amount.');
    }

    const amountLabel = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(orderData.amount / 100);

    const checkout = new window.Razorpay({
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Aviora',
      description: `${amountLabel} at USD/INR ${orderData.exchangeRate.toFixed(4)} (rate date ${orderData.exchangeRateDate})`,
      order_id: orderData.orderId,
      prefill: user.email ? { email: user.email } : {},
      handler: async (paymentResponse) => {
        try {
          const response = await fetch('/api/payment/verify-razorpay-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user.token}`
            },
            body: JSON.stringify(paymentResponse)
          });
          const order = await response.json();
          if (!response.ok) throw new Error(order.message || 'Unable to verify Razorpay payment.');
          await finishOrder({
            order,
            message: 'Razorpay payment confirmed. Your order has been placed.'
          }, 'razorpay');
        } catch (error) {
          console.error('Razorpay payment verification failed:', error);
          toast.error(error.message || 'Unable to verify Razorpay payment.');
          setPlacingOrder(false);
        }
      },
      modal: {
        ondismiss: () => setPlacingOrder(false)
      },
      theme: { color: '#b77954' }
    });

    checkout.on('payment.failed', (event) => {
      console.error('Razorpay payment failed:', event.error);
      toast.error(event.error?.description || 'Razorpay payment failed. Please try again.');
      setPlacingOrder(false);
    });
    checkout.open();
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    if (!user) {
      toast.error('Please login first.');
      navigate('/login');
      return;
    }
    if (!formRef.current?.reportValidity()) return;
    setPlacingOrder(true);
    try {
      const items = cartItems.map(({ productId, qty }) => ({ productId, qty }));
      const endpoints = {
        cod: '/api/payment/cod-order',
        razorpay: '/api/payment/razorpay-order',
        stripe: '/api/payment/checkout-session'
      };
      const orderRes = await fetch(endpoints[paymentMethod], {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ items, address: getShippingAddress(address) })
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.message || `Unable to initialize ${paymentMethod} checkout.`);
      }

      if (paymentMethod === 'cod') {
        await finishOrder(orderData, paymentMethod);
        return;
      }
      if (paymentMethod === 'razorpay') {
        openRazorpayCheckout(orderData);
        return;
      }
      if (typeof orderData.url !== 'string' || !orderData.url) {
        throw new Error('Stripe did not return a Checkout Session URL.');
      }
      window.location.assign(orderData.url);
    } catch (error) {
      console.error('Order placement failed:', error);
      toast.error(error.message || 'Unable to place your order.');
      setPlacingOrder(false);
    } finally {
      if (paymentMethod === 'cod') setPlacingOrder(false);
    }
  };

  const handleAddressChange = (event) => {
    setSelectedAddressId('new');
    setAddress({ ...address, [event.target.name]: event.target.value });
  };

  const handleAddressSelect = (event) => {
    const selectedId = event.target.value;
    setSelectedAddressId(selectedId);
    const selectedAddress = savedAddresses.find((savedAddress) => String(savedAddress._id) === selectedId);
    const [firstName, ...lastName] = selectedAddress?.fullName.trim().split(/\s+/) || [];
    setAddress(selectedAddress ? {
      firstName,
      lastName: lastName.join(' '),
      email: selectedAddress.email || user.email || '',
      street: selectedAddress.street,
      city: selectedAddress.city,
      state: selectedAddress.state || '',
      zipcode: selectedAddress.postalCode,
      country: selectedAddress.country,
      phone: selectedAddress.phone || ''
    } : {
      firstName: '', lastName: '', email: user.email || '', street: '',
      city: '', state: '', zipcode: '', country: '', phone: ''
    });
  };

  const formatAddress = (savedAddress) => (
    `${savedAddress.fullName} — ${savedAddress.street}, ${savedAddress.city}, ${savedAddress.country}`
  );
  const totalUsd = cartItems.reduce((total, item) => total + item.price * item.qty, 0);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
      <section className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-4 sm:p-8">
          <h2 className="mb-5 flex items-center gap-2 text-2xl font-bold">
            <Icon icon="mdi:clipboard-check-outline" className="text-primary" aria-hidden="true" /> Checkout
          </h2>
          <form ref={formRef} onSubmit={handlePlaceOrder}>
            <h5 className="mb-3 flex items-center gap-2 font-semibold"><Icon icon="mdi:map-marker-outline" className="text-primary" aria-hidden="true" />Shipping Address</h5>
            <div className="form-control mb-3">
              <label className="label text-sm whitespace-normal" htmlFor="saved-address">Choose a saved address or enter a new one</label>
              <select id="saved-address" className="select select-bordered w-full" value={selectedAddressId} onChange={handleAddressSelect} disabled={loadingAddresses || placingOrder}>
                {savedAddresses.map((savedAddress) => (
                  <option key={savedAddress._id} value={savedAddress._id}>
                    {formatAddress(savedAddress)}
                  </option>
                ))}
                <option value="new">Use a new address</option>
              </select>
              {loadingAddresses && <small className="mt-1 text-base-content/60">Loading your saved addresses...</small>}
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input aria-label="First name" autoComplete="given-name" className="input input-bordered w-full" name="firstName" placeholder="First name" required value={address.firstName} onChange={handleAddressChange} disabled={placingOrder} />
              <input aria-label="Last name" autoComplete="family-name" className="input input-bordered w-full" name="lastName" placeholder="Last name" required value={address.lastName} onChange={handleAddressChange} disabled={placingOrder} />
              <input aria-label="Email address" autoComplete="email" className="input input-bordered w-full sm:col-span-2" name="email" type="email" placeholder="Email address" required value={address.email || user?.email || ''} onChange={handleAddressChange} disabled={placingOrder} />
              <input aria-label="Street" autoComplete="street-address" className="input input-bordered w-full sm:col-span-2" name="street" placeholder="Street" required value={address.street} onChange={handleAddressChange} disabled={placingOrder} />
              <input aria-label="City" autoComplete="address-level2" className="input input-bordered w-full" name="city" placeholder="City" required value={address.city} onChange={handleAddressChange} disabled={placingOrder} />
              <input aria-label="State" autoComplete="address-level1" className="input input-bordered w-full" name="state" placeholder="State" required value={address.state} onChange={handleAddressChange} disabled={placingOrder} />
              <input aria-label="Zipcode" autoComplete="postal-code" className="input input-bordered w-full" name="zipcode" placeholder="Zipcode" required value={address.zipcode} onChange={handleAddressChange} disabled={placingOrder} />
              <input aria-label="Country" autoComplete="country-name" className="input input-bordered w-full" name="country" placeholder="Country" required value={address.country} onChange={handleAddressChange} disabled={placingOrder} />
              <input aria-label="Phone" autoComplete="tel" className="input input-bordered w-full sm:col-span-2" name="phone" type="tel" placeholder="Phone" required value={address.phone} onChange={handleAddressChange} disabled={placingOrder} />
            </div>
            <fieldset className="mt-5 space-y-1">
              <legend className="mb-2 font-semibold">Payment method</legend>
              <label className="flex cursor-pointer items-center gap-3 py-1.5 text-sm sm:text-base">
                <input type="radio" className="radio radio-primary shrink-0" id="payment-stripe" name="paymentMethod" value="stripe" checked={paymentMethod === 'stripe'} onChange={() => setPaymentMethod('stripe')} disabled={placingOrder} />
                <span>Pay securely with Stripe</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3 py-1.5 text-sm sm:text-base">
                <input type="radio" className="radio radio-primary shrink-0" id="payment-razorpay" name="paymentMethod" value="razorpay" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} disabled={placingOrder} />
                <span>Pay securely with Razorpay</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3 py-1.5 text-sm sm:text-base">
                <input type="radio" className="radio radio-primary shrink-0" id="payment-cod" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} disabled={placingOrder} />
                <span>Cash on delivery</span>
              </label>
              {paymentMethod === 'cod' ? (
                <small className="mt-1 block text-base-content/60">
                  Pay for your order in cash when it is delivered.
                </small>
              ) : paymentMethod === 'razorpay' ? (
                <small className="mt-1 block text-base-content/60">
                  Your USD total is converted to INR using the latest available reference rate. The exact charge is shown in Razorpay Checkout.
                </small>
              ) : (
                <small className="mt-1 block text-base-content/60">
                  You&apos;ll continue to Stripe&apos;s secure checkout to complete payment.
                </small>
              )}
            </fieldset>
            <div className="mt-5 border-t border-base-300 pt-5">
              <CartSummary totalAmount={totalUsd} />
              <button type="submit" className="btn btn-primary btn-lg mt-4 w-full sm:w-auto gap-2" disabled={placingOrder || loadingAddresses || cartItems.length === 0}>
                  <Icon
                    icon={placingOrder ? 'mdi:loading' : paymentMethod === 'cod' ? 'mdi:package-check' : 'mdi:credit-card-outline'}
                    aria-hidden="true"
                  />
                  {placingOrder
                    ? (
                      paymentMethod === 'cod' ? 'Placing COD order…'
                        : paymentMethod === 'razorpay' ? 'Opening Razorpay…'
                          : 'Starting Stripe Checkout…'
                    )
                    : (
                      paymentMethod === 'cod' ? 'Place COD Order'
                        : paymentMethod === 'razorpay' ? 'Continue to Razorpay'
                          : 'Continue to Stripe'
                    )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Checkout;
