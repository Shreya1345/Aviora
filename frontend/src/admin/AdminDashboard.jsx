import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/auth-context';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { formatCurrency } from '../utils/formatCurrency';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/analytics', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setStats(data);
        } else {
          if (res.status === 401) {
            navigate('/login');
          }
          setStats({ totalOrders: 0, totalProducts: 0, totalUsers: 0, revenueUsd: 0, revenueInr: 0 });
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, [user, navigate]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-1 flex items-center gap-3">
        <h2 className="m-0 text-2xl sm:text-3xl font-bold">Admin Dashboard</h2>
      </div>
      <p className="mb-6 sm:mb-8 text-base-content/65">Welcome back, <span className="font-semibold text-base-content">Aviora</span></p>
      
      {stats ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="card border border-base-300 bg-base-100 text-center shadow-sm"><div className="card-body p-5"><h6 className="text-base-content/65">Total Orders</h6><div className="text-3xl sm:text-4xl font-bold text-primary">{stats.totalOrders}</div></div></div>
          <div className="card border border-base-300 bg-base-100 text-center shadow-sm"><div className="card-body p-5"><h6 className="text-base-content/65">Total Products</h6><div className="text-3xl sm:text-4xl font-bold text-primary">{stats.totalProducts}</div></div></div>
          <div className="card border border-base-300 bg-base-100 text-center shadow-sm"><div className="card-body p-5"><h6 className="text-base-content/65">Total Users</h6><div className="text-3xl sm:text-4xl font-bold text-primary">{stats.totalUsers}</div></div></div>
          <div className="card border border-base-300 bg-base-100 text-center shadow-sm"><div className="card-body p-5"><h6 className="text-base-content/65">Revenue (USD)</h6><div className="text-3xl sm:text-4xl font-bold text-primary">{formatCurrency(stats.revenueUsd || 0)}</div>{stats.revenueInr > 0 && <p className="mb-0 mt-2 text-sm text-base-content/60">Historical INR orders: {formatCurrency(stats.revenueInr, 'INR')}</p>}</div></div>
        </div>
      ) : (
        <div className="py-12 text-center"><span className="loading loading-spinner loading-lg text-primary" role="status" /></div>
      )}

      <section className="card mt-6 border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-4 sm:p-6">
          <h3 className="mb-1 text-2xl font-bold text-primary">Administrative Controls</h3>
          <p className="mb-4 text-base-content/65">Manage your store from one place.</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Link to="/admin/add-product" className="btn btn-ghost h-auto justify-start gap-3 border border-base-300 p-4 text-left shadow-sm"><Icon icon="mdi:plus-box-outline" width="26" height="26" className="shrink-0 text-primary" aria-hidden="true" /><span>Add Product</span></Link>
            <Link to="/admin/products" className="btn btn-ghost h-auto justify-start gap-3 border border-base-300 p-4 text-left shadow-sm"><Icon icon="mdi:package-variant-closed" width="26" height="26" className="shrink-0 text-secondary" aria-hidden="true" /><span>Manage Products</span></Link>
            <Link to="/admin/orders" className="btn btn-ghost h-auto justify-start gap-3 border border-base-300 p-4 text-left shadow-sm"><Icon icon="mdi:clipboard-list-outline" width="26" height="26" className="shrink-0 text-accent" aria-hidden="true" /><span>Manage Orders</span></Link>
            <Link to="/admin/users" className="btn btn-ghost h-auto justify-start gap-3 border border-base-300 p-4 text-left shadow-sm"><Icon icon="mdi:account-group-outline" width="26" height="26" className="shrink-0 text-primary" aria-hidden="true" /><span>Users Directory</span></Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
