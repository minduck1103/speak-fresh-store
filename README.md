# 🚀 [Speak Fresh - ECommerce website] 🚀

## Table of Contents
- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [Main Features](#main-features)
- [Screenshots](#screenshots)
- [Website Functionality](#website-functionality)
- [Directory Structure](#directory-structure)
- [Setup Instructions](#setup-instructions)

## Main Features
- User authentication and registration
- Product browsing and searching
- Shopping cart and checkout process
- Order management
- User account management
- Admin and seller dashboards
- Contact and about pages


## Technologies Used
### Frontend
- React
- Vite
- Tailwind CSS
- Bootstrap
- Axios
- Chart.js
- Framer Motion
- React Router DOM
- React Toastify

### Backend
- Node.js
- Express
- MongoDB
- JWT for authentication
- Multer for file uploads
- Nodemailer for email functionality
- Stripe for payment processing

## Screenshots
- **Home Page**:[Screenshot of Home Page](demo/home-page1.png)
                [Screenshot of Home Page](demo/home-page2.png)
                [Screenshot of Home Page](demo/home-page3.png)
                [Screenshot of Home Page](demo/home-page-4.png)
- **Login Page**: [Screenshot of Checkout Page](demo/login-page.png)
- **Register Page**: [Screenshot of Checkout Page](demo/register-page.png)
- **Products Page**:[Screenshot of Products Page](demo/products-page1.png)
                    [Screenshot of Products Page](demo/products-page2.png)
- **Products Page**:[Screenshot of Products Page](demo/product-detail-page.png)
                    [Screenshot of Products Page](demo/product-detail-page1.png)
- **Cart Page**:[Screenshot of Cart Page](demo/cart-empty-page.png)
                [Screenshot of Cart Page](demo/cart-page.png)
- **Orders Page**: [Screenshot of Checkout Page](demo/orders-page.png)



## Website Functionality
The website allows users to browse products, add them to a cart, and proceed to checkout. It includes user authentication, order management, and admin functionalities for managing products and orders.

## Directory Structure
- **Frontend**:
  - `src/`: Contains the main application code
    - `assets/`: Static assets like images
    - `components/`: Reusable UI components
    - `pages/`: Different pages of the application
    - `services/`: API service functions
    - `utility/`: Utility functions
  - `public/`: Public assets
  - `package.json`: Frontend dependencies and scripts

- **Backend**:
  - `routes/`: API route definitions
  - `controllers/`: Business logic for routes
  - `models/`: Database models
  - `middleware/`: Custom middleware
  - `config/`: Configuration files
  - `utils/`: Utility functions
  - `server.js`: Entry point for the server
  - `package.json`: Backend dependencies and scripts

## Setup Instructions
 -**Clone the repository**:
   ```bash
   git clone <https://github.com/minduck1103/speak-fresh-store.git>
   cd speak-fresh
   ```
 -**Install dependencies**:
   - For the frontend:
     ```bash
     cd frontend
     npm install
     ```
   - For the backend:
     ```bash
     cd backend
     npm install
     ```
-**Run the application**:
   - Start the frontend:
     ```bash
     npm run dev
     ```
   - Start the backend:
     ```bash
     npm run dev
     ```