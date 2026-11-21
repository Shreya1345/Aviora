import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/auth-context';
import ProductCard from '../components/ProductCard';
import { Icon } from '@iconify/react';

const Wishlist = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch('/api/wishlist', { headers: { Authorization: `Bearer ${user.token}` } })
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data.products) ? data.products : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md card rounded-3xl border border-base-300 bg-base-100 p-10 shadow-md">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/15">
            <Icon icon="mdi:heart-outline" className="text-3xl text-secondary" aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            Your Wishlist
          </h2>
          <p className="mt-2 mb-6 text-sm text-base-content/65">
            Sign in to view and save your favorite high-jewelry pieces.
          </p>
          <Link
            to="/login"
            className="btn btn-primary mx-auto inline-flex items-center gap-2 shadow-md"
            style={{ background: 'linear-gradient(135deg, #b76e79, #c9956b)' }}
          >
            <Icon icon="mdi:login" aria-hidden="true" /> Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <span className="badge badge-secondary mb-2 px-3 py-1">Saved Collection</span>
        <h1 className="text-3xl font-bold sm:text-4xl" style={{ fontFamily: "'Playfair Display', serif" }}>
          Curated Wishlist
        </h1>
        <p className="mt-1 text-sm text-base-content/65">
          {products.length} {products.length === 1 ? 'piece' : 'pieces'} saved to your personal collection
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <span className="loading loading-spinner loading-lg text-primary" role="status" />
        </div>
      ) : products.length === 0 ? (
        <div className="card items-center rounded-3xl border border-base-300 bg-base-100 p-12 text-center shadow-sm">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-secondary/10">
            <Icon icon="mdi:heart-broken-outline" width="40" className="text-secondary" aria-hidden="true" />
          </div>
          <h3 className="mb-2 text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            Your wishlist is empty
          </h3>
          <p className="mb-6 max-w-md text-base-content/65">
            Explore our collections and tap the heart icon on any piece to save it for later.
          </p>
          <Link
            to="/shop"
            className="btn btn-primary mx-auto inline-flex items-center gap-2 shadow-md"
            style={{ background: 'linear-gradient(135deg, #b76e79, #c9956b)' }}
          >
            <Icon icon="mdi:storefront-outline" aria-hidden="true" /> Browse Collections
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product._id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
