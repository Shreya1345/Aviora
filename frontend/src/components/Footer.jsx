import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-base-300 bg-base-200 text-base-content/80">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand info */}
          <div>
            <Link to="/" className="mb-3 inline-flex items-center gap-2 text-2xl font-bold tracking-widest text-base-content">
              <span style={{ fontFamily: "'Playfair Display', serif" }}>AVIORA</span>
              <span className="text-primary">.</span>
            </Link>
            <p className="text-sm leading-relaxed text-base-content/70">
              Handcrafted fine jewelry crafted with ethical gemstones and certified precious metals. Designed to celebrate your most cherished moments.
            </p>
            <Link to="/about" className="link link-hover mt-3 inline-block text-sm text-primary">
              Our Story
            </Link>
          </div>

          {/* Quick links */}
          <div>
            <h5 className="mb-4 text-xs font-bold uppercase tracking-widest text-base-content">
              Collections
            </h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/shop" className="link link-hover text-base-content/70 hover:text-primary">
                  All Jewelry
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Rings" className="link link-hover text-base-content/70 hover:text-primary">
                  Rings
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Necklaces" className="link link-hover text-base-content/70 hover:text-primary">
                  Necklaces
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Earrings" className="link link-hover text-base-content/70 hover:text-primary">
                  Earrings
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Bracelets" className="link link-hover text-base-content/70 hover:text-primary">
                  Bracelets
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h5 className="mb-4 text-xs font-bold uppercase tracking-widest text-base-content">
              Customer Care
            </h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="link link-hover text-base-content/70 hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/return" className="link link-hover text-base-content/70 hover:text-primary">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="link link-hover text-base-content/70 hover:text-primary">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="link link-hover text-base-content/70 hover:text-primary">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link to="/cart" className="link link-hover text-base-content/70 hover:text-primary">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h5 className="mb-4 text-xs font-bold uppercase tracking-widest text-base-content">
              Follow Us
            </h5>
            <p className="text-sm text-base-content/70 mb-4">
              Explore our latest designs and behind-the-scenes craft on social media.
            </p>
            <div className="flex gap-2">
              {[
                { icon: 'mdi:instagram', label: 'Instagram', href: 'https://www.instagram.com/' },
                { icon: 'mdi:facebook', label: 'Facebook', href: 'https://www.facebook.com/' },
                { icon: 'mdi:pinterest', label: 'Pinterest', href: 'https://www.pinterest.com/' },
              ].map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-circle btn-sm btn-outline border-base-300 text-base-content/70 hover:border-primary hover:bg-primary hover:text-white"
                >
                  <Icon icon={item.icon} width="16" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* ───────── Bottom Copyright Bar ───────── */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-base-300 pt-6 text-xs text-base-content/60 sm:flex-row">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} Aviora Jewelry. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <span>Secure Stripe Payments</span>
            <span>&bull;</span>
            <span>Certified Jewelry</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
