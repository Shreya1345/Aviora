import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

const Disclaimer = () => {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-4 sm:p-10">
          <nav aria-label="Breadcrumb" className="breadcrumbs mb-4 text-xs">
            <ul>
              <li><Link to="/" className="text-base-content/60 hover:text-primary">Home</Link></li>
              <li aria-current="page" className="text-primary font-medium">Disclaimer</li>
            </ul>
          </nav>

          <h1 className="mb-4 text-2xl font-bold sm:text-4xl" style={{ fontFamily: "'Playfair Display', serif" }}>
            Legal &amp; Authenticity Disclaimer
          </h1>
          <p className="mb-6 leading-relaxed text-base-content/75">
            This platform represents the digital e-commerce presence for Aviora, showcasing fine jewelry, gemstone pieces, and secure transaction workflows.
          </p>

          <div className="space-y-6 border-t border-base-300 pt-6">
            <div>
              <h2 className="mb-2 text-lg font-bold text-primary flex items-center gap-2">
                <Icon icon="mdi:shield-check-outline" /> 1. Product Photography &amp; Descriptions
              </h2>
              <p className="leading-relaxed text-base-content/70">
                All jewelry images featured on this platform are curated to reflect authentic materials, metal finishes, and gemstone color tones. Due to differences in monitor displays, natural gemstone color variations, and lighting conditions, actual pieces may have subtle, unique natural variations.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-bold text-primary flex items-center gap-2">
                <Icon icon="mdi:credit-card-lock-outline" /> 2. Payment &amp; Security Protocols
              </h2>
              <p className="leading-relaxed text-base-content/70">
                Online payments are securely processed through Stripe or Razorpay. Razorpay charges are converted from USD to INR using the latest available reference exchange rate when the order is placed. Cash-on-delivery orders are paid upon delivery.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-bold text-primary flex items-center gap-2">
                <Icon icon="mdi:diamond-stone" /> 3. Gemstone Certification
              </h2>
              <p className="leading-relaxed text-base-content/70">
                Gold purity (18K &amp; 22K) and diamond grading specifications correspond to laboratory certification benchmarks. Each individual high-jewelry piece is accompanied by its corresponding certificate upon shipment.
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-base-300 pt-6 flex justify-between items-center">
            <Link to="/shop" className="btn btn-primary w-full sm:w-auto text-white">
              <Icon icon="mdi:storefront-outline" /> Return to Collections
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
