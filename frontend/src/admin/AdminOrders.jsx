import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/auth-context';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import { formatCurrency } from '../utils/formatCurrency';

const AdminOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    };
    fetchOrders();
  }, [user]);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Unable to update order status.');
      setOrders(orders.map(order => order._id === id ? { ...order, status } : order));
      toast.success('Order status updated.');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Unable to update order status.');
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="mb-0 flex items-center gap-2 text-2xl font-bold text-primary">
          <Icon icon="mdi:clipboard-list-outline" aria-hidden="true" /> Manage Orders
        </h2>
      </div>
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>USER</th>
                <th>TOTAL</th>
                <th>PAYMENT</th>
                <th>DATE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td className="font-mono text-xs">{order._id.substring(0, 8)}...</td>
                  <td>{order.userId?.name || 'Deleted User'}</td>
                  <td>{formatCurrency(order.totalAmount, order.currency || 'INR')}</td>
                  <td>{order.paymentProvider?.toUpperCase() || '—'}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="select select-bordered select-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
