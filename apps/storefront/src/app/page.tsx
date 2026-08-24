'use client';

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStorefrontCategories, getProducts, Product, Category } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import { CategoryCard } from '@/components/CategoryCard';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [cats, prods] = await Promise.all([
          getStorefrontCategories(),
          getProducts(6), // Use getProducts instead
        ]);
        setCategories(cats);
        setProducts(prods.filter((p) => p.isFeatured).slice(0, 6)); // Filter featured locally
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-luxury-charcoal via-luxury-brown to-luxury-charcoal text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-luxury-gold/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-luxury-darkGold/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-light tracking-tight mb-6">
              Luxury Crafted. <span className="text-luxury-gold">Worldwide Delivered.</span>
            </h1>
            <p className="text-xl text-luxury-cream/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Discover exquisite hand-knotted rugs, artisan crafts, and bespoke designs from master craftspeople around the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-10 py-4 bg-luxury-gold text-white font-serif tracking-wider uppercase hover:bg-luxury-darkGold transition-all hover:shadow-lg"
              >
                Shop Now →
              </Link>
              <Link
                href="#featured"
                className="inline-flex items-center justify-center px-10 py-4 bg-white/10 text-white font-serif tracking-wider uppercase hover:bg-white/20 transition-colors border border-white/30"
              >
                Explore Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Section */}
      {!loading && categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-serif font-light text-luxury-charcoal mb-4">Featured Collections</h2>
            <p className="text-lg text-luxury-brown">Handpicked luxury pieces just for you</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.slice(0, 4).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      {!loading && products.length > 0 && (
        <section id="featured" className="bg-luxury-beige py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-serif font-light text-luxury-charcoal mb-4">Curated Selections</h2>
              <p className="text-lg text-luxury-brown">Discover our most sought-after pieces</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-8">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center mt-16">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-10 py-4 bg-luxury-charcoal text-white font-serif tracking-wider uppercase hover:bg-luxury-brown transition-all hover:shadow-lg"
              >
                View All Products →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Why LuxeCraft Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="text-center">
            <div className="text-5xl font-serif text-luxury-gold mb-4">100%</div>
            <h3 className="text-xl font-serif text-luxury-charcoal mb-3">Authentic Craftsmanship</h3>
            <p className="text-luxury-brown leading-relaxed">Every piece handcrafted by master artisans with decades of experience</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-serif text-luxury-gold mb-4">∞</div>
            <h3 className="text-xl font-serif text-luxury-charcoal mb-3">Global Reach</h3>
            <p className="text-luxury-brown leading-relaxed">Worldwide shipping with customs support and white-glove delivery</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-serif text-luxury-gold mb-4">✓</div>
            <h3 className="text-xl font-serif text-luxury-charcoal mb-3">Lifetime Guarantee</h3>
            <p className="text-luxury-brown leading-relaxed">Premium quality backed by our satisfaction and durability guarantee</p>
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 text-luxury-brown">
              <div className="w-4 h-4 bg-luxury-gold rounded-full animate-pulse" />
              <span className="font-serif">Loading luxury collection...</span>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="bg-luxury-charcoal text-white py-20 sm:py-28">
        <div className="max-w-2xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-serif font-light mb-4">Stay Updated</h2>
          <p className="text-luxury-cream/80 mb-10 leading-relaxed">Subscribe to our newsletter for new collections and exclusive offers</p>
          <form
            className="flex flex-col sm:flex-row gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              alert('Newsletter signup coming soon!');
            }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-4 bg-white text-luxury-charcoal placeholder-luxury-brown/50 border border-luxury-sand focus:outline-none focus:border-luxury-gold"
              required
            />
            <button
              type="submit"
              className="px-10 py-4 bg-luxury-gold text-white font-serif tracking-wider uppercase hover:bg-luxury-darkGold transition-all whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
