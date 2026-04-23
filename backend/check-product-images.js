const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

async function checkProductImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all products
    const products = await Product.find({});
    
    // Update products with real image URLs
    for (const product of products) {
      if (product.image.includes('via.placeholder.com')) {
        // Replace with real image URLs
        const updatedProduct = await Product.findByIdAndUpdate(
          product._id,
          { 
            image: `https://images.unsplash.com/photo-16067874845-5f93f0b7c5cda?ixlib=rb-4.0.3&ixid=MnwxMjw7Ij90AA1Xf4q&auto=format&fit=crop&w=400&q=mukhwas+indian+mouth+freshener`,
            description: product.description,
            category: product.category,
            price: product.price,
            stock: product.stock,
            featured: product.featured,
            weight: product.weight,
            ingredients: product.ingredients
          }
        );
        
        console.log(`Updated product: ${product.name} with new image URL`);
      }
    }
    
    console.log('Product images updated successfully');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error updating product images:', error);
  }
}

checkProductImages();
