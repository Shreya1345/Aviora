import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth-context';
import { useSelector } from 'react-redux';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';
  const [search, setSearch] = useState('');

  const handleLogout = () => {
    logout();
    toast.success('Logged out.');
    navigate('/', { replace: true });
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/shop?q=${encodeURIComponent(query)}` : '/shop', { replace: true });
  };

  const navLink = (to, icon, label) => (
    <Link
      to={to}
      className="btn btn-ghost btn-sm text-xs font-semibold uppercase tracking-wider text-base-content/80 hover:text-primary hover:bg-base-200/60"
    >
      <Icon icon={icon} width="16" aria-hidden="true" /> {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-base-300/80 bg-base-100/95 backdrop-blur-md">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="navbar relative min-h-16 gap-3 px-0 py-2">
          {/* Brand Logo */}
          <Link
            className="flex shrink-0 items-center gap-2 text-2xl font-bold tracking-widest text-base-content"
            to={isAdmin ? '/admin' : '/'}
          >
            <span style={{ fontFamily: "'Playfair Display', serif" }}>
              AVIORA<span className="text-primary">.</span>
            </span>
          </Link>

          {/* Search Bar - DaisyUI join */}
          {!isAdmin && (
            <form
              onSubmit={handleSearch}
              className="join absolute left-1/2 hidden w-full max-w-xs -translate-x-1/2 sm:flex"
              role="search"
            >
              <span className="join-item flex items-center bg-base-200 px-3 text-base-content/50">
                <Icon icon="mdi:magnify" width="18" aria-hidden="true" />
              </span>
              <input
                type="search"
                placeholder="Search collection..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="input input-sm join-item w-full bg-base-200 focus:bg-base-100 focus:outline-none"
                aria-label="Search products"
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm join-item text-white"
                aria-label="Search"
              >
                <Icon icon="mdi:arrow-right" width="16" />
              </button>
            </form>
          )}

          {/* Nav Actions */}
          <nav className="ml-auto flex items-center gap-1 sm:gap-2" aria-label="Main navigation">
            {!isAdmin && (
              <>
                {navLink('/shop', 'mdi:storefront-outline', 'Collections')}
                <Link
                  to="/cart"
                  className="btn btn-ghost btn-sm text-xs font-semibold uppercase tracking-wider text-base-content/80 hover:text-primary hover:bg-base-200/60"
                >
                  <Icon icon="mdi:cart-outline" width="16" aria-hidden="true" />
                  <span>Cart</span>
                  <span className="badge badge-primary badge-sm text-white font-bold">{cartItems.length}</span>
                </Link>
                {navLink('/wishlist', 'mdi:heart-outline', 'Wishlist')}
              </>
            )}

            {user ? (
              <>
                {navLink('/profile', 'mdi:account-circle-outline', isAdmin ? 'Aviora' : user.name)}
                {isAdmin && navLink('/admin', 'mdi:view-dashboard-outline', 'Dashboard')}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-ghost btn-sm text-xs font-semibold uppercase tracking-wider text-error"
                >
                  <Icon icon="mdi:logout" width="16" aria-hidden="true" /> Logout
                </button>
              </>
            ) : (
              navLink('/login', 'mdi:login', 'Login')
            )}
          </nav>
        </div>

        {/* Mobile search bar */}
        {!isAdmin && (
          <form onSubmit={handleSearch} className="join flex sm:hidden pb-3 w-full" role="search">
            <span className="join-item flex items-center bg-base-200 px-3 text-base-content/50">
              <Icon icon="mdi:magnify" width="18" aria-hidden="true" />
            </span>
            <input
              type="search"
              placeholder="Search collection..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="input input-sm join-item w-full bg-base-200 focus:bg-base-100 focus:outline-none"
              aria-label="Search products"
            />
            <button
              type="submit"
              className="btn btn-primary btn-sm join-item text-white"
              aria-label="Search"
            >
              <Icon icon="mdi:arrow-right" width="16" />
            </button>
          </form>
        )}
      </div>
    </header>
  );
};

export default Navbar;
