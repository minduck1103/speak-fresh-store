# Speak Fresh Backend

Backend API for Speak Fresh E-commerce application.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Stripe Payment

## Setup

1. Clone the repository
```bash
git clone https://github.com/your-username/speakfresh-backend.git
cd speakfresh-backend
```

2. Install dependencies
```bash
npm install
```

3. Create .env file
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

4. Run development server
```bash
npm run dev
```

## API Documentation

### Authentication
- POST /api/v1/auth/register
- POST /api/v1/auth/login
- POST /api/v1/auth/logout

### Products
- GET /api/v1/products
- GET /api/v1/products/:id
- POST /api/v1/products
- PUT /api/v1/products/:id
- DELETE /api/v1/products/:id

### Orders
- GET /api/v1/orders
- POST /api/v1/orders
- PUT /api/v1/orders/:id

## Deployment

This backend is deployed on Render.com 