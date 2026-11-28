import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/auth-context';
import { useNavigate, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import { formatCurrency } from '../utils/formatCurrency';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role === 'admin') {
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const res = await fetch('/api/orders/myorders', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setOrders(Array.isArray(data) ? data : []);
        } else {
          // Token obsolete or 401: clear and bounce
          if (res.status === 401) {
             logout();
             navigate('/login');
          }
          setOrders([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, [user, navigate, logout]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out.');
    navigate('/', { replace: true });
  };

  if (!user) return null;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
      <section className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body flex flex-col justify-between gap-6 border-b border-base-300 sm:flex-row">
        <div>
          <h2 className="mb-3 flex items-center gap-2 text-3xl font-bold">
            <Icon icon="mdi:account-circle-outline" className="text-primary" aria-hidden="true" />My Profile
          </h2>
          <p className="mb-1 text-base-content/70"><strong>Name:</strong> {user.name}</p>
          <p className="mb-4 text-base-content/70"><strong>Email:</strong> {user.email}</p>
          <span className="badge badge-primary badge-outline">Account Type: {user.role.toUpperCase()}</span>
        </div>
        <button onClick={handleLogout} className="btn btn-error btn-outline self-start">
          <Icon icon="mdi:logout" aria-hidden="true" /> Logout
        </button>
        </div>

      {user.role !== 'admin' && (
        <div className="card-body">
          <h3 className="mb-1 flex items-center gap-2 text-xl font-bold">
            <Icon icon="mdi:clipboard-list-outline" className="text-primary" aria-hidden="true" />Order History
          </h3>
          {loading ? (
            <div className="py-6 text-center"><span className="loading loading-spinner text-primary" role="status" /></div>
          ) : orders.length === 0 ? (
            <div className="rounded-2xl border border-base-300 bg-base-200 p-8 text-center">
              <p className="mb-4 text-base-content/65">You haven't placed any orders yet.</p>
              <Link to="/shop" className="btn btn-primary">
                <Icon icon="mdi:storefront-outline" aria-hidden="true" /> Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {orders.map(order => (
                <article key={order._id} className="card border border-base-300 bg-base-100 shadow-sm">
                  <div className="card-body gap-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="mb-1 text-sm text-base-content/60">
                          Order ID: <span className="break-all font-mono text-base-content">{order._id}</span>
                        </p>
                        <p className="mb-1 text-sm text-base-content/60">
                          Placed On: <span className="text-base-content">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </p>
                        <p className="text-sm text-base-content/60">
                          Total: <strong className="text-success">{formatCurrency(order.totalAmount, order.currency || 'USD')}</strong>
                        </p>
                        {order.paymentCurrency && Number.isInteger(order.paymentAmountMinor) && (
                          <p className="text-sm text-base-content/60">
                            Charged: <strong className="text-success">
                              {formatCurrency(order.paymentAmountMinor / 100, order.paymentCurrency)}
                            </strong>
                            {Number.isFinite(order.exchangeRate) && (
                              <span>
                                {' · USD/INR rate: '}
                                {formatCurrency(order.exchangeRate, 'INR')}
                                {order.exchangeRateDate ? ` (${order.exchangeRateDate})` : ''}
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                      <span className={`badge ${order.status === 'Delivered' ? 'badge-success' : order.status === 'Shipped' ? 'badge-info' : 'badge-warning'}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="divide-y divide-base-300">
                      {(order.items || []).map((item, index) => {
                        const productName = item.name || item.productId?.name || 'Unavailable product';
                        const imageUrl = item.imageUrl || item.productId?.imageUrl;

                        return (
                          <div key={`${order._id}-${item.productId?._id || item.productId || index}`} className="flex items-center gap-4 py-3">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={productName}
                                className="h-16 w-16 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-base-200 text-base-content/40">
                                <Icon icon="mdi:image-off-outline" aria-hidden="true" />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold">{productName}</p>
                              <p className="text-sm text-base-content/65">
                                Qty: {item.qty} · {formatCurrency(item.price, order.currency || 'USD')} each
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
      </section>
    </div>
  );
};

export default Profile;
