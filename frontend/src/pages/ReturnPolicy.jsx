import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

const ReturnPolicy = () => {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-4 sm:p-10">
          <nav aria-label="Breadcrumb" className="breadcrumbs mb-4 text-xs">
            <ul>
              <li><Link to="/" className="text-base-content/60 hover:text-primary">Home</Link></li>
              <li aria-current="page" className="text-primary font-medium">Return Policy</li>
            </ul>
          </nav>

          <h1 className="mb-4 text-2xl font-bold sm:text-4xl" style={{ fontFamily: "'Playfair Display', serif" }}>
            Return &amp; Refund Policy
          </h1>
          <p className="mb-6 leading-relaxed text-base-content/75">
            At Aviora, we take immense pride in the artistry and precision of our handcrafted fine jewelry. If for any reason you are not completely enchanted with your purchase, you may initiate a return or exchange within 30 days of delivery.
          </p>

          <div className="space-y-6 border-t border-base-300 pt-6">
            <div>
              <h2 className="mb-2 text-lg font-bold text-primary flex items-center gap-2">
                <Icon icon="mdi:check-decagram-outline" /> 1. Eligibility for Returns
              </h2>
              <p className="leading-relaxed text-base-content/70">
                To be eligible for a return, the jewelry piece must be in its original, unworn condition, free from scratches, adjustments, or damage, and returned with all original laboratory certificates, authenticity documentation, and signature velvet packaging.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-bold text-primary flex items-center gap-2">
                <Icon icon="mdi:cash-refund" /> 2. Refund Processing
              </h2>
              <p className="leading-relaxed text-base-content/70">
                Once your returned piece is securely received and verified by our certified gemologists, an email notification will confirm the approval. Approved refunds are credited directly back to your original payment method via Stripe within 5–7 business days.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-bold text-primary flex items-center gap-2">
                <Icon icon="mdi:ring" /> 3. Custom &amp; Bespoke Orders
              </h2>
              <p className="leading-relaxed text-base-content/70">
                Custom engraved items and specially resized pieces tailored to personal measurements are crafted uniquely for you and may be subject to a nominal re-polishing or resizing fee upon return.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-bold text-primary flex items-center gap-2">
                <Icon icon="mdi:truck-delivery-outline" /> 4. Insured Doorstep Pickup
              </h2>
              <p className="leading-relaxed text-base-content/70">
                We provide fully insured doorstep pickup for all approved returns across India, ensuring your precious items remain safe and protected throughout transit.
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

export default ReturnPolicy;
