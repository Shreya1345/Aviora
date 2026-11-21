import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import WishlistButton from './WishlistButton';
import RatingDisplay from './RatingDisplay';
import { Icon } from '@iconify/react';
import { formatCurrency } from '../utils/formatCurrency';

const ProductCard = ({ product }) => {
  const price = formatCurrency(product.price);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="h-full"
    >
      <article className="card h-full overflow-hidden rounded-2xl bg-base-100 shadow-md transition-shadow duration-300 hover:shadow-xl">
        {/* NEW badge */}
        <div className="absolute left-0 top-0 z-[3] p-3">
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-widest text-secondary-content shadow">
            New
          </span>
        </div>

        {/* Wishlist button */}
        <div className="absolute right-0 top-0 z-[3] p-2">
          <WishlistButton productId={product._id} rounded />
        </div>

        {/* Image with gradient overlay */}
        <div className="relative">
          <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.35 }}>
            <img src={product.imageUrl} alt={product.name} className="h-72 w-full object-cover" />
          </motion.div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-base-100/80 to-transparent" />
        </div>

        <div className="card-body flex flex-col">
          <h2 className="card-title truncate font-serif">{product.name}</h2>
          <div className="mb-2">
            <RatingDisplay rating={product.ratings} count={product.numReviews} showCount={false} />
          </div>
          <p className="mb-3 text-lg font-semibold text-secondary">{price}</p>
          <Link to={`/product/${product._id}`} className="btn btn-primary mt-auto inline-flex items-center justify-center gap-2">
            Discover <Icon icon="mdi:arrow-right" width="18" aria-hidden="true" />
          </Link>
        </div>
      </article>
    </motion.div>
  );
};

export default ProductCard;
