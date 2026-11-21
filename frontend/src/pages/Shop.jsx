import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { Icon } from '@iconify/react';
import { formatCurrency } from '../utils/formatCurrency';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loadedQuery, setLoadedQuery] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q')?.trim() || '';
  const categoryFilters = searchParams.getAll('category').map((category) => category.trim()).filter(Boolean);
  const [maxPriceFilter, setMaxPriceFilter] = useState(null);
  const [sortBy, setSortBy] = useState('default');
  const formatPrice = (amount) => formatCurrency(amount);
  const loading = loadedQuery !== query;

  useEffect(() => {
    const controller = new AbortController();
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/products${query ? `?q=${encodeURIComponent(query)}` : ''}`, {
          signal: controller.signal
        });
        if (!res.ok) throw new Error('Unable to load products.');
        const data = await res.json();
        const foundProducts = Array.isArray(data) ? data : [];
        setProducts(foundProducts);
        setSearchError('');

        if (query && foundProducts.length === 0) {
          try {
            const recommendationResponse = await fetch('/api/products', { signal: controller.signal });
            if (!recommendationResponse.ok) throw new Error('Unable to load product recommendations.');
            const allProducts = await recommendationResponse.json();
            const suggestedProducts = Array.isArray(allProducts) ? allProducts : [];
            setRecommendations(
              suggestedProducts
                .filter((product) => Number(product.stock) > 0)
                .sort((left, right) => (
                  Number(right.ratings || 0) - Number(left.ratings || 0)
                  || Number(right.numReviews || 0) - Number(left.numReviews || 0)
                ))
                .slice(0, 4)
            );
          } catch (error) {
            if (!controller.signal.aborted) {
              console.error('Unable to load product recommendations:', error);
              setRecommendations([]);
            }
          }
        } else {
          setRecommendations([]);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error(error);
          setProducts([]);
          setRecommendations([]);
          setSearchError('We could not load products. Please try again.');
        }
      } finally {
        if (!controller.signal.aborted) setLoadedQuery(query);
      }
    };
    fetchProducts();
    return () => controller.abort();
  }, [query]);

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [products]
  );
  const priceCeiling = products.reduce((highest, product) => Math.max(highest, Number(product.price) || 0), 0);
  const selectedMaxPrice = maxPriceFilter === null ? priceCeiling : Math.min(maxPriceFilter, priceCeiling);
  const filteredProducts = products
    .filter((product) => (
      (categoryFilters.length === 0 || categoryFilters.some(
        (category) => product.category?.toLowerCase() === category.toLowerCase()
      ))
      && Number(product.price) <= selectedMaxPrice
    ))
    .sort((left, right) => {
      if (sortBy === 'price-asc') return Number(left.price) - Number(right.price);
      if (sortBy === 'price-desc') return Number(right.price) - Number(left.price);
      if (sortBy === 'name-asc') return left.name.localeCompare(right.name);
      if (sortBy === 'name-desc') return right.name.localeCompare(left.name);
      return 0;
    });

  const toggleCategory = (category) => {
    const nextParams = new URLSearchParams(searchParams);
    const selected = categoryFilters.some((value) => value.toLowerCase() === category.toLowerCase());
    const nextCategories = selected
      ? categoryFilters.filter((value) => value.toLowerCase() !== category.toLowerCase())
      : [...categoryFilters, category];
    nextParams.delete('category');
    nextCategories.forEach((value) => nextParams.append('category', value));
    setSearchParams(nextParams);
  };

  const clearFilters = () => {
    setMaxPriceFilter(null);
    setSortBy('default');
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('category');
    setSearchParams(nextParams);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.section
        aria-label="Shop banner"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative mb-8 overflow-hidden rounded-3xl shadow-xl"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.pexels.com/photos/248077/pexels-photo-248077.jpeg?auto=compress&cs=tinysrgb&w=1920)' }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 p-8 sm:p-10">
          <h1 className="mb-2 text-4xl font-bold text-white">Our Collections</h1>
          <p className="mb-0 text-lg text-white/75">Explore our curated selection of fine jewelry.</p>
        </div>
      </motion.section>

      <section aria-label="Product catalog">
      {loading ? (
        <div className="py-12 text-center"><span className="loading loading-spinner loading-lg text-primary" role="status" /></div>
      ) : searchError ? (
        <div className="py-12 text-center text-error" role="alert">
          <h5>Unable to load products</h5>
          <p className="mb-0">{searchError}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <aside aria-label="Product filters">
              <div className="card border border-base-300 bg-base-100 shadow-sm" style={{ borderTop: '3px solid #b76e79' }}>
                <div className="card-body">
                  <div className="mb-3 flex items-center gap-2">
                    <Icon icon="mdi:tune-variant" className="text-primary" aria-hidden="true" />
                    <h2 className="mb-0 text-lg font-bold">Filters &amp; Sort</h2>
                  </div>

                  <div className="form-control mb-5">
                    <label className="label font-medium" htmlFor="shop-sort">Sort by</label>
                    <select id="shop-sort" className="select select-bordered w-full" value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort products">
                      <option value="default">Featured</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="name-asc">Name: A to Z</option>
                      <option value="name-desc">Name: Z to A</option>
                    </select>
                  </div>

                  <div className="form-control mb-5">
                    <label className="label flex justify-between font-medium">
                      <span>Maximum price</span>
                      <span className="text-primary">{formatPrice(selectedMaxPrice)}</span>
                    </label>
                    <input
                      type="range"
                      className="range range-primary"
                      min="0"
                      max={priceCeiling}
                      step="1"
                      value={selectedMaxPrice}
                      onChange={(event) => setMaxPriceFilter(Number(event.target.value))}
                      disabled={priceCeiling === 0}
                      aria-label="Maximum product price"
                    />
                    <div className="flex justify-between text-sm text-base-content/60">
                      <span>{formatPrice(0)}</span>
                      <span>{formatPrice(priceCeiling)}</span>
                    </div>
                  </div>

                  <fieldset className="mb-4">
                    <legend className="mb-2 font-semibold">Categories</legend>
                    {categories.length > 0 ? categories.map((category, index) => (
                      <label key={category} htmlFor={`shop-category-${index}`} className="label cursor-pointer justify-start gap-3 py-1">
                        <input
                          id={`shop-category-${index}`}
                          type="checkbox"
                          className="checkbox checkbox-primary checkbox-sm"
                          checked={categoryFilters.some(
                            (filter) => filter.toLowerCase() === category.toLowerCase()
                          )}
                          onChange={() => toggleCategory(category)}
                        />
                        <span>{category}</span>
                      </label>
                    )) : (
                      <p className="mb-0 text-sm text-base-content/60">No categories available.</p>
                    )}
                  </fieldset>

                  <button
                    className="btn btn-outline w-full"
                    onClick={clearFilters}
                  >
                    <Icon icon="mdi:filter-remove-outline" aria-hidden="true" />
                    Clear filters
                  </button>
                </div>
              </div>
            </aside>
          </div>
          <div className="lg:col-span-9">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="mb-0 text-2xl font-bold">
                {categoryFilters.length > 0
                  ? categories
                    .filter((category) => categoryFilters.some((filter) => filter.toLowerCase() === category.toLowerCase()))
                    .join(', ') || categoryFilters.join(', ')
                  : 'All Pieces'}
              </h2>
              <span className="text-base-content/60">{filteredProducts.length} products</span>
            </div>
            {filteredProducts.length === 0 ? (
              <div className="rounded-2xl border border-base-300 bg-base-100 py-12 text-center text-base-content/60">
                <h5>
                  {products.length === 0
                    ? (query ? `No products found for "${query}"` : 'No products found')
                    : 'No products match these filters'}
                </h5>
                {query && products.length === 0 && <p>Try a different search or explore these picks.</p>}
                {products.length > 0 && (
                  <button className="btn btn-link" onClick={clearFilters}>Clear filters</button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <div key={product._id}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
            {products.length === 0 && recommendations.length > 0 && (
              <section className="mt-4" aria-label="Recommended products">
                <h3 className="mb-3 text-xl font-bold">You may also like</h3>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {recommendations.map((product) => (
                    <div key={product._id}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      )}
      </section>
    </div>
  );
};

export default Shop;
