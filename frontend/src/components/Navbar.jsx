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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setMobileMenuOpen(false);
    logout();
    toast.success('Logged out.');
    navigate('/', { replace: true });
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setMobileMenuOpen(false);
    const query = search.trim();
    navigate(query ? `/shop?q=${encodeURIComponent(query)}` : '/shop', { replace: true });
  };

  const navLink = (to, icon, label, extraClass = '') => (
    <Link
      to={to}
      onClick={() => setMobileMenuOpen(false)}
      className={`btn btn-ghost btn-sm text-xs font-semibold uppercase tracking-wider text-base-content/80 hover:text-primary hover:bg-base-200/60 ${extraClass}`}
    >
      <Icon icon={icon} width="16" aria-hidden="true" /> {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-base-300/80 bg-base-100/95 backdrop-blur-md">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="navbar min-h-16 gap-2 px-0 py-2">
          {/* Brand Logo */}
          <Link
            onClick={() => setMobileMenuOpen(false)}
            className="flex shrink-0 items-center gap-2 text-xl sm:text-2xl font-bold tracking-widest text-base-content"
            to={isAdmin ? '/admin' : '/'}
          >
            <span style={{ fontFamily: "'Playfair Display', serif" }}>
              AVIORA<span className="text-primary">.</span>
            </span>
          </Link>

          {/* Search Bar - DaisyUI join (tablet/desktop) */}
          {!isAdmin && (
            <form onSubmit={handleSearch} className="join hidden md:flex w-full max-w-xs ml-4" role="search">
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

          {/* Desktop Nav Actions */}
          <nav className="ml-auto hidden md:flex items-center gap-1 lg:gap-2" aria-label="Main navigation">
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

          {/* Mobile Quick Actions + Menu Toggle */}
          <div className="ml-auto flex items-center gap-2 md:hidden">
            {!isAdmin && (
              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-ghost btn-sm btn-circle text-base-content/80 hover:text-primary"
                aria-label={`Cart (${cartItems.length} items)`}
              >
                <div className="indicator">
                  <Icon icon="mdi:cart-outline" width="22" aria-hidden="true" />
                  <span className="badge badge-primary badge-xs indicator-item text-white font-bold">
                    {cartItems.length}
                  </span>
                </div>
              </Link>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="btn btn-ghost btn-sm btn-square text-base-content"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              <Icon icon={mobileMenuOpen ? 'mdi:close' : 'mdi:menu'} width="22" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <nav
            aria-label="Mobile navigation"
            className="flex flex-col gap-1 border-t border-base-300/70 py-3 md:hidden"
          >
            {!isAdmin && (
              <>
                {navLink('/shop', 'mdi:storefront-outline', 'Collections', 'justify-start w-full')}
                {navLink('/wishlist', 'mdi:heart-outline', 'Wishlist', 'justify-start w-full')}
              </>
            )}
            {user ? (
              <>
                {navLink('/profile', 'mdi:account-circle-outline', isAdmin ? 'Aviora' : user.name, 'justify-start w-full')}
                {isAdmin && navLink('/admin', 'mdi:view-dashboard-outline', 'Dashboard', 'justify-start w-full')}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-ghost btn-sm w-full justify-start text-xs font-semibold uppercase tracking-wider text-error"
                >
                  <Icon icon="mdi:logout" width="16" aria-hidden="true" /> Logout
                </button>
              </>
            ) : (
              navLink('/login', 'mdi:login', 'Login', 'justify-start w-full')
            )}
          </nav>
        )}

        {/* Mobile search bar */}
        {!isAdmin && (
          <form onSubmit={handleSearch} className="join flex md:hidden pb-3 w-full" role="search">
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
