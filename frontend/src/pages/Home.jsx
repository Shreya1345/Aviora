import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { Icon } from '@iconify/react';

const heroSlides = [
  {
    id: 1,
    tag: 'Haute Joaillerie',
    category: 'Rings',
    title: 'Timeless Elegance, Crafted for Eternity',
    subtitle: 'Exquisite diamond solitaires and handcrafted bands set in luminous 18K gold. Crafted to celebrate your rarest moments.',
    image: 'https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=1920',
    stat: 'Certified D-Flawless Diamonds',
    ctaText: 'Discover Solitaires',
    ctaLink: '/shop?q=Ring',
  },
  {
    id: 2,
    tag: 'Imperial Heirlooms',
    category: 'Necklaces',
    title: 'The Allure of Radiant Emeralds',
    subtitle: 'Vibrant natural emeralds and diamond halos woven into handcrafted 22K gold filigree. Heirloom jewelry designed to be treasured.',
    image: 'https://images.pexels.com/photos/2849742/pexels-photo-2849742.jpeg?auto=compress&cs=tinysrgb&w=1920',
    stat: '22K Solid Gold & Natural Gems',
    ctaText: 'Explore Necklaces',
    ctaLink: '/shop?q=Necklace',
  },
  {
    id: 3,
    tag: 'Artisan Drops',
    category: 'Earrings',
    title: 'Captivating Brilliance in Motion',
    subtitle: 'Cascading chandelier earrings and pearl drops that catch and reflect light with every turn, adding effortless drama.',
    image: 'https://images.pexels.com/photos/1232931/pexels-photo-1232931.jpeg?auto=compress&cs=tinysrgb&w=1920',
    stat: 'Lustrous Pearls & Fine Crystals',
    ctaText: 'View Earrings',
    ctaLink: '/shop?q=Earring',
  },
  {
    id: 4,
    tag: 'Modern Grace',
    category: 'Bracelets',
    title: 'Continuous Bands of Shimmering Light',
    subtitle: 'Delicate tennis bracelets and articulated bangles in warm rose gold, embodying modern refinement and timeless luxury.',
    image: 'https://images.pexels.com/photos/1395306/pexels-photo-1395306.jpeg?auto=compress&cs=tinysrgb&w=1920',
    stat: 'Continuous Diamond Brilliance',
    ctaText: 'Browse Bracelets',
    ctaLink: '/shop?q=Bracelet',
  },
];

const categories = [
  {
    name: 'Rings',
    image: 'https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg?auto=compress&cs=tinysrgb&w=600',
    link: '/shop?q=Ring',
  },
  {
    name: 'Necklaces',
    image: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=600',
    link: '/shop?q=Necklace',
  },
  {
    name: 'Earrings',
    image: 'https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&cs=tinysrgb&w=600',
    link: '/shop?q=Earring',
  },
  {
    name: 'Bracelets',
    image: 'https://images.pexels.com/photos/1395306/pexels-photo-1395306.jpeg?auto=compress&cs=tinysrgb&w=600',
    link: '/shop?q=Bracelet',
  },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(Array.isArray(data) ? data.slice(0, 4) : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Slide rotation timer
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const slide = heroSlides[currentSlide];

  return (
    <div className="w-full">
      {/* ───────── Beautiful Animated Hero Section ───────── */}
      <section
        id="hero"
        aria-label="Jewelry banner carousel"
        className="relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative min-h-[500px] sm:min-h-[620px] lg:min-h-[680px] flex items-center justify-center">
          {/* Animated Background Banner with Ken Burns zoom effect */}
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, scale: 1.12 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Cinematic Vignette & Dark Gradients */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/75" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40" />
            </motion.div>
          </AnimatePresence>

          {/* Floating Live Spec Badge */}
          <motion.div
            key={`badge-${slide.id}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: [0, -8, 0] }}
            transition={{
              opacity: { duration: 0.5 },
              y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
            }}
            className="absolute top-8 right-8 z-20 hidden md:flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-xs font-semibold text-white/90 backdrop-blur-md shadow-2xl"
          >
            <Icon icon="mdi:diamond-stone" className="text-secondary text-base animate-pulse" />
            <span>{slide.stat}</span>
          </motion.div>

          {/* Hero Banner Content */}
          <div className="relative z-10 mx-auto max-w-4xl px-12 pt-12 pb-24 text-center text-white sm:px-16 sm:py-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              >
                {/* Collection Tag */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="mb-4 inline-flex items-center gap-2 rounded-full border border-secondary/40 bg-black/30 px-3 py-1 sm:px-4 sm:py-1.5 backdrop-blur-md"
                >
                  <Icon icon="mdi:sparkles" className="text-secondary text-sm animate-spin" style={{ animationDuration: '6s' }} />
                  <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-secondary">
                    {slide.tag}
                  </span>
                </motion.div>

                {/* Main Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="mb-4 sm:mb-5 text-3xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl drop-shadow-md"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {slide.title}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                  className="mx-auto mb-6 sm:mb-8 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-lg"
                >
                  {slide.subtitle}
                </motion.p>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.45, duration: 0.5 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
                    <Link
                      to={slide.ctaLink}
                      className="btn btn-primary btn-md sm:btn-lg w-full sm:w-auto text-white font-semibold shadow-2xl border-none"
                      style={{ background: 'linear-gradient(135deg, #b76e79 0%, #d4af37 100%)' }}
                    >
                      <Icon icon="mdi:storefront-outline" className="text-xl" />
                      {slide.ctaText}
                    </Link>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
                    <Link
                      to="/about"
                      className="btn btn-outline btn-md sm:btn-lg w-full sm:w-auto text-white border-white/50 backdrop-blur-md hover:bg-white hover:text-neutral hover:border-white"
                    >
                      Our Story
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Left Arrow Button */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
            aria-label="Previous Slide"
            className="btn btn-circle btn-sm btn-ghost absolute left-2 top-1/2 -translate-y-1/2 z-20 text-white bg-black/40 hover:bg-white hover:text-black border border-white/20 backdrop-blur-md transition-all sm:left-6"
          >
            <Icon icon="mdi:chevron-left" className="text-2xl" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
            aria-label="Next Slide"
            className="btn btn-circle btn-sm btn-ghost absolute right-2 top-1/2 -translate-y-1/2 z-20 text-white bg-black/40 hover:bg-white hover:text-black border border-white/20 backdrop-blur-md transition-all sm:right-6"
          >
            <Icon icon="mdi:chevron-right" className="text-2xl" />
          </button>

          {/* Interactive Category Switcher Tabs at Bottom */}
          <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex w-full max-w-full flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3">
            {heroSlides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`flex items-center gap-1.5 sm:gap-2 rounded-full px-3 py-1 sm:px-4 sm:py-1.5 text-[11px] sm:text-xs font-semibold backdrop-blur-md transition-all duration-300 ${
                  currentSlide === idx
                    ? 'bg-secondary text-secondary-content shadow-lg scale-105'
                    : 'bg-black/35 text-white/70 hover:bg-black/60 hover:text-white border border-white/10'
                }`}
              >
                <span>{s.category}</span>
                {currentSlide === idx && (
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary-content animate-pulse" />
                )}
              </button>
            ))}
          </div>

          {/* Dynamic Progress Timer Line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
            <motion.div
              key={currentSlide}
              initial={{ width: '0%' }}
              animate={{ width: isPaused ? '0%' : '100%' }}
              transition={{ duration: 5.5, ease: 'linear' }}
              className="h-full bg-gradient-to-r from-primary to-secondary"
            />
          </div>
        </div>
      </section>

      {/* ───────── Categories Section ───────── */}
      <section aria-label="Jewelry categories" className="mx-auto max-w-7xl px-4 py-10 sm:py-16 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-10 text-center">
          <span className="badge badge-secondary mb-2 px-3 py-1 text-xs font-semibold uppercase">Categories</span>
          <h2
            className="text-2xl font-bold sm:text-4xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Shop by Category
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -6 }}
            >
              <Link to={cat.link} className="card overflow-hidden bg-base-100 shadow-sm border border-base-300 group">
                <figure className="relative h-56 sm:h-72 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {cat.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-secondary">
                      View Collection <Icon icon="mdi:arrow-right" />
                    </span>
                  </div>
                </figure>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ───────── Store Benefits ───────── */}
      <section aria-label="Store benefits" className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            ['Free Shipping', 'Reliable doorstep shipping across India', 'mdi:truck-fast-outline', 'text-success'],
            ['Certified Authentic', 'Genuine gemstones & precious metals', 'mdi:diamond-stone', 'text-primary'],
            ['Easy Returns', '30-day hassle-free return policy', 'mdi:refresh', 'text-warning'],
          ].map(([title, text, icon, colorClass], index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="card border border-base-300 bg-base-100 p-6 shadow-sm"
            >
              <div className={`text-3xl mb-3 ${colorClass}`}>
                <Icon icon={icon} aria-hidden="true" />
              </div>
              <h5 className="font-bold text-lg mb-1">{title}</h5>
              <p className="text-sm text-base-content/65 mb-0">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ───────── Featured Products ───────── */}
      <section id="featured-products" aria-label="Featured products" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="badge badge-secondary mb-2">Featured</span>
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Our Finest Pieces
            </h2>
          </div>
          <Link to="/shop" className="btn btn-outline btn-primary btn-sm inline-flex items-center gap-1">
            View All <Icon icon="mdi:arrow-right" aria-hidden="true" />
          </Link>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <span className="loading loading-spinner loading-lg text-primary" role="status" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, index) => (
              <div key={product._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="h-full"
                >
                  <ProductCard product={product} />
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
