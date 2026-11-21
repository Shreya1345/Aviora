# Aviora

Aviora is a full-stack e-commerce application for browsing jewelry, managing a cart and wishlist, placing orders, and writing product reviews. It includes a role-protected admin area for managing the catalog, orders, and users.

## Features

### Storefront

- Home page, product catalog, product details, and product search
- USD product pricing and server-calculated cart totals
- Account registration, login, order history, and saved shipping addresses
- Database-backed cart and wishlist for signed-in customers
- Stripe Checkout, Razorpay, and cash-on-delivery payment options
- Product ratings and reviews restricted to customers who purchased the product
- About, disclaimer, and return-policy pages

### Administration

- Dashboard with order, product, user, and revenue statistics
- Product creation, editing, and deletion, including Cloudinary image uploads
- Order listing and status management
- User directory

Admin pages and admin API operations require an authenticated account with the `admin` role. Registration creates a regular user; grant admin access only through a trusted administrative process.

## Technology

- **Frontend:** React 19, React Router, Redux Toolkit, Vite, Tailwind CSS, DaisyUI, and Framer Motion
- **Backend:** Node.js, Express 5, Mongoose, and MongoDB
- **Authentication:** JWT
- **Payments:** Stripe and Razorpay
- **Images:** Cloudinary and Multer

## Requirements

- Node.js 20.19 or newer
- npm
- MongoDB, either a local instance or MongoDB Atlas
- Cloudinary credentials for product image uploads
- Stripe and/or Razorpay credentials for the payment methods you intend to use

## Local setup

1. Install the root, backend, and frontend dependencies:

   ```bash
   npm install
   ```

   The root `install` script installs the backend and frontend dependencies as well as the root development tools.

2. Create `backend/.env` and configure the required database and authentication values:

   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/aviora
   JWT_SECRET=replace-with-a-long-random-secret
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```

3. Add provider credentials for the features you will use:

   ```env
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=

   STRIPE_SECRET_KEY=
   STRIPE_WEBHOOK_SECRET=

   RAZORPAY_KEY_ID=
   RAZORPAY_KEY_SECRET=
   RAZORPAY_WEBHOOK_SECRET=
   ```

   Cloudinary values are needed for product image uploads. Stripe and Razorpay credentials are only needed for their corresponding payment methods. Webhook secrets must match the signing secrets configured with each payment provider. Keep all credentials server-side and never commit `.env` files.

4. Optionally add the sample jewelry products to the configured database:

   ```bash
   npm --prefix backend run seed
   ```

   The seed script upserts six sample products by name and resets their fields, including prices. Run it against a development database, not a database whose product values you want to preserve.

5. Start the frontend and backend:

   ```bash
   npm run dev
   ```

   The frontend is served at `http://localhost:5173` and the API at `http://localhost:5000`. Vite forwards `/api` requests to the backend. `FRONTEND_URL` should match the frontend origin when using a different host or port.

## Available commands

Run commands from the project root unless noted otherwise.

| Command | Description |
| --- | --- |
| `npm install` | Install root, backend, and frontend dependencies |
| `npm run dev` | Run frontend and backend concurrently |
| `npm run dev:client` | Run the Vite frontend only |
| `npm run dev:server` | Run the backend only |
| `npm run build` | Build the frontend into `frontend/dist` |
| `npm --prefix frontend run lint` | Lint the frontend |
| `node --test backend/services/currencyConversion.test.js backend/services/paymentError.test.js` | Run the backend service tests |
| `npm --prefix backend run seed` | Upsert the sample products into MongoDB |

For production, build the frontend and run the backend with `NODE_ENV=production`; the Express server serves the generated `frontend/dist` files in production mode.

## Pricing and payments

Product prices are stored in MongoDB and treated as USD. The backend builds cart quotes from current product records; it does not rely on prices supplied by the browser. Order items keep a price snapshot, so changing a catalog price does not rewrite existing orders.

- **Stripe:** Uses Stripe-hosted Checkout and server-side session verification. Configure the webhook endpoint `POST /api/payment/webhook/stripe` for `checkout.session.completed`, `checkout.session.async_payment_succeeded`, and `checkout.session.async_payment_failed`.
- **Razorpay:** Converts the USD cart total to INR using the latest available USD/INR reference rate from Frankfurter when creating the order. The exchange rate and date are saved with the payment attempt/order. If a current rate cannot be retrieved, Razorpay order creation stops rather than using a stale or guessed rate. Configure `POST /api/payment/webhook/razorpay` for `payment.captured` and `payment.failed`.
- **Cash on delivery:** Creates an order without an online payment.

Use provider test credentials during development. Configure and verify the corresponding webhook signing secrets before relying on webhooks in production.

## API overview

All API routes are prefixed with `/api`. Routes marked **authenticated** require a bearer JWT; **admin** routes also require the admin role.

| Area | Routes | Access |
| --- | --- | --- |
| Authentication | `POST /auth/register`, `POST /auth/login`, `GET/POST /auth/addresses`, `GET /auth/users` | Public registration/login; addresses authenticated; users admin |
| Products | `GET /products`, `GET /products/:id`, `POST /products`, `PUT /products/:id`, `DELETE /products/:id` | Reads public; writes admin |
| Cart | `GET /cart`, `PUT /cart`, `DELETE /cart` | Authenticated |
| Wishlist | `GET /wishlist`, `PUT /wishlist/:productId` | Authenticated |
| Orders | `GET /orders/myorders`, `GET /orders`, `PUT /orders/:id/status` | Own orders authenticated; list/status admin |
| Payments | `POST /payment/checkout-session`, `POST /payment/verify-session`, `POST /payment/razorpay-order`, `POST /payment/verify-razorpay-payment`, `POST /payment/cod-order` | Authenticated |
| Payment webhooks | `POST /payment/webhook/stripe`, `POST /payment/webhook/razorpay` | Provider signature-verified |
| Reviews | `GET /reviews/product/:productId`, `POST /reviews/product/:productId` | Read public; submission authenticated and purchase-verified |
| Analytics | `GET /analytics` | Admin |

## Project layout

```text
.
├── backend/
│   ├── config/          # MongoDB and Cloudinary configuration
│   ├── controllers/     # API request handlers
│   ├── middleware/      # Authentication and admin authorization
│   ├── models/          # Mongoose models
│   ├── routes/          # Express API routes
│   ├── services/        # Cart pricing, currency conversion, payment helpers
│   ├── seed.js           # Sample product upsert
│   └── server.js         # Express application
├── frontend/
│   ├── src/
│   │   ├── admin/       # Admin pages
│   │   ├── components/  # Shared UI components
│   │   ├── context/     # Authentication context
│   │   ├── pages/       # Storefront and account pages
│   │   ├── redux/       # Redux store and cart state
│   │   └── utils/       # Shared frontend utilities
│   └── vite.config.js   # Vite configuration and API proxy
├── package.json
└── README.md
```

## Security notes

- Use strong, unique secrets and keep database/payment credentials out of source control.
- Use payment-provider test keys for development and production keys only in a properly secured deployment.
- Configure webhook signing secrets and verify provider events before relying on automated payment updates.
- Restrict database access and Cloudinary credentials to the minimum required permissions.
