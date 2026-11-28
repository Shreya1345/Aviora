import { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import WishlistButton from '../components/WishlistButton';
import RatingDisplay from '../components/RatingDisplay';
import ReviewList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/auth-context';
import { formatCurrency } from '../utils/formatCurrency';

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [quantitySelection, setQuantitySelection] = useState({ productId: id, quantity: 1 });
  const quantity = quantitySelection.productId === id ? quantitySelection.quantity : 1;
  const cartItems = useSelector((state) => state.cart.cartItems);
  const cartQuantity = cartItems.find((item) => item.productId === product?._id)?.qty || 0;
  const stock = Number(product?.stock);
  const availableToAdd = Number.isFinite(stock) ? Math.max(0, stock - cartQuantity) : 0;
  const selectedQuantity = availableToAdd > 0 ? Math.min(quantity, availableToAdd) : 0;
  const updateQuantity = (nextQuantity) => setQuantitySelection({ productId: id, quantity: nextQuantity });
  const formatPrice = (amount) => formatCurrency(amount);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    fetch(`/api/reviews/product/${id}`)
      .then((res) => res.json())
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setReviews([]));
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      toast.info('Please log in or register before adding products to your cart.');
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }
    if (!product) return;
    if (selectedQuantity <= 0 || selectedQuantity > availableToAdd) {
      toast.error('The selected quantity exceeds the available stock.');
      return;
    }

    dispatch(addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      qty: cartQuantity + selectedQuantity
    }));
    toast.success(`Added ${selectedQuantity} ${selectedQuantity === 1 ? 'piece' : 'pieces'} to your bag.`);
  };

  if (loading) return <div className="py-16 text-center"><span className="loading loading-spinner loading-lg text-primary" role="status" /></div>;
  if (!product) return <div className="py-16 text-center text-error font-serif text-xl">Piece Not Found</div>;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="breadcrumbs mb-6 text-sm">
        <ul>
          <li><Link to="/" className="text-base-content/60 hover:text-primary">Home</Link></li>
          <li><Link to="/shop" className="text-base-content/60 hover:text-primary">Collections</Link></li>
          <li aria-current="page" className="font-medium text-primary">{product.name}</li>
        </ul>
      </nav>

      <section className="card overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-lg">
        <div className="card-body p-6 sm:p-10">
          <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2">
            {/* Product Image */}
            <div className="relative overflow-hidden rounded-2xl bg-base-200">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="max-h-[520px] w-full object-cover shadow-sm transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute top-4 right-4 z-10">
                <WishlistButton productId={product._id} rounded />
              </div>
              <div className="absolute top-4 left-4 z-10">
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-widest text-secondary-content shadow">
                  Certified Fine Jewelry
                </span>
              </div>
            </div>

            {/* Product Information */}
            <div className="flex flex-col">
              <span className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
                {product.category || 'High Jewelry'}
              </span>
              <h1 className="mb-3 text-3xl font-bold sm:text-4xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                {product.name}
              </h1>

              <div className="mb-4 flex items-center gap-3">
                <RatingDisplay rating={product.ratings} count={product.numReviews} large />
                <span className="text-sm text-base-content/50">|</span>
                <span className="text-sm text-base-content/60">SKU: AV-{product._id?.slice(-6).toUpperCase()}</span>
              </div>

              <p className="mb-6 text-3xl font-bold text-secondary">
                {formatPrice(product.price)}
              </p>

              <div className="mb-6 border-y border-base-300 py-4">
                <h5 className="mb-2 text-sm font-semibold uppercase tracking-wider text-base-content/80">
                  Description &amp; Details
                </h5>
                <p className="leading-relaxed text-base-content/75">{product.description}</p>
              </div>

              {/* Jewelry Assurance Badges */}
              <div className="mb-6 grid grid-cols-2 gap-3 rounded-2xl bg-base-200/60 p-4 text-xs text-base-content/80">
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:diamond-stone" className="text-lg text-primary" />
                  <span>100% Certified Authentic</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:shield-check-outline" className="text-lg text-primary" />
                  <span>Lifetime Craftsmanship Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:truck-delivery-outline" className="text-lg text-primary" />
                  <span>Free Insured Express Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:gift-outline" className="text-lg text-primary" />
                  <span>Luxury Velvet Gift Box Included</span>
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <span className="mb-2 block text-sm font-semibold uppercase tracking-wider text-base-content/80">Quantity</span>
                <div className="join" aria-label="Select product quantity">
                  <button
                    type="button"
                    className="btn btn-outline join-item"
                    aria-label="Decrease quantity"
                    onClick={() => updateQuantity(Math.max(1, selectedQuantity - 1))}
                    disabled={selectedQuantity <= 1}
                  >
                    <Icon icon="mdi:minus" aria-hidden="true" />
                  </button>
                  <output className="join-item flex items-center border border-base-300 px-5 font-semibold" aria-live="polite">
                    {selectedQuantity}
                  </output>
                  <button
                    type="button"
                    className="btn btn-outline join-item"
                    aria-label="Increase quantity"
                    onClick={() => updateQuantity(Math.min(availableToAdd, selectedQuantity + 1))}
                    disabled={selectedQuantity >= availableToAdd}
                  >
                    <Icon icon="mdi:plus" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Add to Cart CTA */}
              <button
                onClick={handleAddToCart}
                className="btn btn-primary btn-lg w-full gap-2 shadow-lg"
                style={{ background: 'linear-gradient(135deg, #b76e79, #c9956b)' }}
                disabled={availableToAdd <= 0}
              >
                <Icon icon="mdi:shopping-outline" className="text-xl" aria-hidden="true" /> Add to Shopping Bag
              </button>

              <p className={`mt-3 text-sm font-semibold ${product.stock > 0 ? 'text-success' : 'text-error'}`}>
                {product.stock > 0 ? `✓ In Stock (${product.stock} pieces available)` : 'Temporarily Out of Stock'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ReviewList reviews={reviews} />
        </div>
        <div className="lg:col-span-5">
          <ReviewForm productId={product._id} onSubmitted={setReviews} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
