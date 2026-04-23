# Admin Dashboard Guide

## 🚀 How to Access Backend and Add Products

### 1. **Start the Backend Server**
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:5000`

### 2. **Start the Frontend**
```bash
cd frontend
npm start
```
The frontend will run on `http://localhost:3000`

### 3. **Create Admin Account**
1. Go to `http://localhost:3000/register`
2. Create an account with your email and password
3. **Important**: After registration, you need to manually set the user role to 'admin' in the database

### 4. **Set Admin Role (One-time Setup)**
Open MongoDB Compass or use MongoDB shell:
```javascript
// Connect to your database
use mukhwas

// Update your user to admin role
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

### 5. **Login as Admin**
1. Go to `http://localhost:3000/login`
2. Login with your admin credentials
3. You should now see "Admin Dashboard" in the user menu

### 6. **Access Admin Dashboard**
- Click on your name in the top-right corner
- Select "Admin Dashboard" from the dropdown
- Or go directly to `http://localhost:3000/admin`

## 📦 Adding Products

### Method 1: Through Admin Dashboard (Recommended)
1. Go to Admin Dashboard
2. Click on "Products" tab
3. Click "Add Product" button
4. Fill in the product details:
   - **Name**: Product name (e.g., "Traditional Saunf Mukhwas")
   - **Price**: Price in rupees (e.g., 120)
   - **Description**: Detailed product description
   - **Category**: Select from dropdown (Traditional, Herbal, Sweet, etc.)
   - **Ingredients**: List of ingredients separated by commas
   - **Stock**: Available quantity
   - **Weight**: Package weight (e.g., "200g")
   - **Featured**: Check if this is a featured product
5. Click "Save Product"

### Method 2: Using API Directly
You can also add products using API tools like Postman:

**POST** `http://localhost:5000/api/products`

Headers:
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

Body:
```json
{
  "name": "Traditional Saunf Mukhwas",
  "price": 120,
  "description": "A classic blend of fennel seeds...",
  "category": "Traditional",
  "ingredients": ["Fennel Seeds", "Sugar", "Cardamom"],
  "image": "/uploads/traditional-saunf.jpg",
  "stock": 50,
  "featured": true,
  "weight": "200g"
}
```

## 🖼️ Managing Product Images

### Upload Images via API
**POST** `http://localhost:5000/api/upload`

Headers:
```
Authorization: Bearer <your-jwt-token>
Content-Type: multipart/form-data
```

Body: Form data with file field named "image"

### Manual Image Placement
1. Place images in `backend/uploads/` folder
2. Reference them as `/uploads/your-image-name.jpg`

## 📊 Managing Orders

### View Orders
1. Go to Admin Dashboard
2. Click on "Orders" tab
3. View all customer orders

### Update Order Status
1. In Orders tab, find the order
2. Use the dropdown to change status:
   - Pending → Processing → Shipped → Delivered
   - Or Cancel if needed
3. Status updates automatically save

## 👥 Managing Users

### View All Users
1. Go to Admin Dashboard
2. Users are listed in the stats section
3. For detailed user management, you can use MongoDB Compass

## 🔧 Backend API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Orders
- `GET /api/orders` - Get all orders (Admin only)
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (Admin only)

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## 🛠️ Database Management

### Using MongoDB Compass
1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017/mukhwas`
3. Browse collections: users, products, orders, carts

### Using MongoDB Shell
```bash
mongo
use mukhwas
show collections
db.users.find().pretty()
```

## 🌱 Seeding Sample Data

If you want to reset and add sample products:
```bash
cd backend
npm run seed
```

This will:
- Clear existing products
- Add 8 sample mukhwas products
- Set up proper categories and pricing

## 🔒 Security Notes

- Always use JWT tokens for admin operations
- Keep your JWT secret secure in .env file
- Regular users cannot access admin endpoints
- All admin routes require authentication + admin role

## 🚨 Troubleshooting

### Can't access Admin Dashboard?
1. Check if user role is set to 'admin' in database
2. Clear browser cache and localStorage
3. Verify JWT token is valid

### Products not saving?
1. Check MongoDB connection
2. Verify all required fields are filled
3. Check browser console for errors

### Images not displaying?
1. Ensure images are in `backend/uploads/` folder
2. Check file permissions
3. Verify image paths in database

---

## 📞 Need Help?

If you encounter issues:
1. Check browser console for JavaScript errors
2. Verify backend is running on port 5000
3. Ensure MongoDB is running
4. Check .env files are properly configured
