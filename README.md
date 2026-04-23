# Mukhwas eCommerce Website

A full-stack eCommerce website for selling traditional Indian mouth fresheners (Mukhwas) built with React, Node.js, Express, and MongoDB.

## 🛍️ Features

### User Features
- **Authentication**: User registration, login, and logout with JWT
- **Product Catalog**: Browse products with search and filter functionality
- **Product Details**: Detailed product pages with images, descriptions, and ingredients
- **Shopping Cart**: Add, update, and remove items from cart
- **Checkout**: Complete checkout process with address form
- **Order Management**: View order history and status
- **Responsive Design**: Mobile-friendly interface

### Admin Features
- **Admin Dashboard**: Role-based access control
- **Product Management**: Add, edit, delete products
- **Order Management**: View and update order status
- **User Management**: View all registered users
- **Analytics**: Dashboard with sales statistics

## 🛠️ Tech Stack

### Frontend
- **React.js** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **React Toastify** for notifications
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **multer** for file uploads
- **CORS** for cross-origin requests

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd mukhwas-ecommerce
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment variables
cp .env.example .env
# Or create .env file manually with the following:
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mukhwas
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### 3. Database Setup

Make sure MongoDB is running on your system or use MongoDB Atlas.

```bash
# Seed the database with sample products
npm run seed
```

### 4. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment variables
cp .env.example .env
# Or create .env file manually with the following:
```

Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 5. Running the Application

#### Start Backend Server
```bash
# From the backend directory
npm run dev
```
The backend will run on `http://localhost:5000`

#### Start Frontend Development Server
```bash
# From the frontend directory
npm start
```
The frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
mukhwas-ecommerce/
├── backend/
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── uploads/        # File upload directory
│   ├── server.js       # Main server file
│   ├── seedProducts.js # Database seeding script
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React context providers
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── utils/       # Utility functions
│   │   └── App.tsx      # Main App component
│   └── package.json
└── README.md
```

## 🎨 Design & Theming

The application uses an Indian traditional theme with:
- **Primary Colors**: Green shades representing freshness
- **Secondary Colors**: Saffron/Orange for warmth
- **Accent Colors**: Gold for premium feel
- **Typography**: Clean, modern fonts
- **Responsive**: Mobile-first design approach

## 📱 Available Pages

### User Pages
- `/` - Homepage with featured products
- `/products` - Product listing with search and filters
- `/product/:id` - Individual product details
- `/cart` - Shopping cart management
- `/checkout` - Checkout process
- `/login` - User login
- `/register` - User registration

### Admin Pages
- `/admin` - Admin dashboard (requires admin role)

## 🔐 Authentication

- **JWT-based authentication** with secure password hashing
- **Role-based access control** (User/Admin)
- **Protected routes** for authenticated users
- **Automatic token refresh** and logout on expiration

## 📦 Product Categories

- Traditional
- Herbal
- Sweet
- Spicy
- Medicinal
- Fruit
- Special

## 🛒 Order Management

### Order Status Flow
1. **Pending** - Order placed, awaiting processing
2. **Processing** - Order being prepared
3. **Shipped** - Order dispatched
4. **Delivered** - Order delivered successfully
5. **Cancelled** - Order cancelled

## 🚀 Deployment

### Backend Deployment
1. Set environment variables for production
2. Build and deploy to your preferred platform (Heroku, AWS, etc.)
3. Ensure MongoDB connection string is updated for production

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, etc.)
3. Update `REACT_APP_API_URL` to point to production backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 Future Enhancements

- Payment gateway integration (Razorpay/PayPal)
- Product reviews and ratings
- Wishlist functionality
- Email notifications
- Advanced search with filters
- Product recommendations
- Inventory management
- Discount coupon system
- Multi-language support

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in .env file

2. **CORS Issues**
   - Verify backend CORS configuration
   - Check frontend API URL

3. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT secret in backend .env

4. **Image Upload Issues**
   - Ensure uploads directory exists
   - Check file permissions

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and queries, please create an issue in the repository.

---

**Happy Shopping! 🛍️**
