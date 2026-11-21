import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AuthContext } from '../context/auth-context';
import { clearCart } from '../redux/cartSlice';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';

const PaymentSuccess = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const sessionId = new URLSearchParams(location.search).get('session_id');
  const prerequisiteError = !sessionId
    ? 'Stripe Checkout session ID was not found.'
    : !user?.token
      ? 'Please log in again to verify your payment.'
      : '';

  useEffect(() => {
    if (!sessionId || !user?.token) return undefined;

    let active = true;
    const verifyPayment = async () => {
      try {
        const response = await fetch('/api/payment/verify-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify({ sessionId })
        });
        const order = await response.json();
        if (!response.ok) throw new Error(order.message || 'Unable to verify Stripe payment.');

        let addressSaved = true;
        try {
          const addressResponse = await fetch('/api/auth/addresses', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user.token}`
            },
            body: JSON.stringify(order.address)
          });
          const addressResult = await addressResponse.json();
          if (!addressResponse.ok) {
            throw new Error(addressResult.message || 'Unable to save shipping address.');
          }
        } catch (addressError) {
          addressSaved = false;
          console.error('Order was placed, but the shipping address could not be saved:', addressError);
        }

        try {
          const cartResponse = await fetch('/api/cart', {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${user.token}` }
          });
          if (!cartResponse.ok) console.error('Order was placed, but the server cart could not be cleared.');
        } catch (cartError) {
          console.error('Order was placed, but the server cart could not be cleared:', cartError);
        }

        if (!active) return;
        dispatch(clearCart());
        if (!addressSaved) {
          toast.warning('Order placed, but the shipping address could not be saved for future checkouts.');
        }
        navigate('/ordersuccess', {
          replace: true,
          state: {
            message: 'Stripe payment confirmed. Your order has been placed.',
            orderId: order._id,
            paymentProvider: 'stripe'
          }
        });
      } catch (verificationError) {
        if (active) {
          console.error('Stripe payment verification failed:', verificationError);
          setError(verificationError.message || 'Unable to verify Stripe payment.');
        }
      }
    };

    verifyPayment();
    return () => {
      active = false;
    };
  }, [dispatch, navigate, sessionId, user?.token]);

  const displayError = error || prerequisiteError;

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-16 sm:px-6">
      <section className="card border border-base-300 bg-base-100 text-center shadow-sm">
        <div className="card-body items-center p-8 sm:p-12">
          {displayError ? (
            <>
              <Icon icon="mdi:alert-circle-outline" className="mb-3 text-error" width="56" aria-hidden="true" />
              <h1 className="text-2xl font-bold">Payment verification needs attention</h1>
              <p className="text-base-content/70" role="alert">{displayError}</p>
              {!user && <Link to="/login" className="btn btn-primary">Log in</Link>}
              <Link to="/profile" className="btn btn-outline">View Orders</Link>
            </>
          ) : (
            <>
              <span className="loading loading-spinner loading-lg text-primary" role="status" />
              <p className="mt-3 text-base-content/70">Verifying your Stripe payment...</p>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default PaymentSuccess;
