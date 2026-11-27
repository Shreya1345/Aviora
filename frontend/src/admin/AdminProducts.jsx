import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/auth-context';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import { formatCurrency } from '../utils/formatCurrency';

const AdminProducts = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Unable to load products.');
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        toast.error(error.message || 'Unable to load products.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you strictly sure you want to delete this?')) {
      try {
        const res = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Unable to delete product.');
        setProducts(products.filter(p => p._id !== id));
        toast.success('Product deleted successfully.');
      } catch (error) {
        console.error(error);
        toast.error(error.message || 'Unable to delete product.');
      }
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="mb-0 flex items-center gap-2 text-2xl font-bold text-primary">
          <Icon icon="mdi:package-variant-closed" aria-hidden="true" /> Manage Products
        </h2>
        <Link to="/admin/add-product" className="btn btn-primary inline-flex items-center gap-2">
          <Icon icon="mdi:plus" aria-hidden="true" /> Add Product
        </Link>
      </div>
      {loading ? (
        <div className="py-12 text-center"><span className="loading loading-spinner loading-lg text-primary" role="status" /></div>
      ) : (
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>STOCK</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td>{product._id.substring(0, 8)}...</td>
                <td>{product.name}</td>
                <td>{formatCurrency(product.price)}</td>
                <td>{product.category}</td>
                <td>{product.stock}</td>
                <td>
                  <div className="flex flex-wrap gap-2">
                    <Link to={`/admin/edit-product/${product._id}`} className="btn btn-sm btn-primary inline-flex items-center gap-1">
                      <Icon icon="mdi:pencil-outline" aria-hidden="true" /> Edit
                    </Link>
                    <button onClick={() => handleDelete(product._id)} className="btn btn-sm btn-error inline-flex items-center gap-1">
                      <Icon icon="mdi:trash-can-outline" aria-hidden="true" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
      )}
    </div>
  );
};

export default AdminProducts;
