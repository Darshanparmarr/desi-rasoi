const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const sampleProducts = [
  {
    name: 'Traditional Saunf Mukhwas',
    description: 'A classic blend of fennel seeds, sugar-coated saunf, and traditional spices. Perfect after meals for fresh breath and digestion.',
    price: 120,
    category: 'Traditional',
    ingredients: ['Fennel Seeds', 'Sugar', 'Cardamom', 'Clove', 'Mishri'],
    image: '/uploads/traditional-saunf.jpg',
    stock: 50,
    featured: true,
    weight: '200g',
    rating: 4.5,
    numReviews: 12
  },
  {
    name: 'Herbal Digestive Mix',
    description: 'Medicinal herbs and spices blend that aids digestion and provides natural relief from stomach discomfort.',
    price: 150,
    category: 'Herbal',
    ingredients: ['Ajwain', 'Jeera', 'Mint', 'Ginger', 'Black Salt'],
    image: '/uploads/herbal-digestive.jpg',
    stock: 30,
    featured: true,
    weight: '150g',
    rating: 4.7,
    numReviews: 8
  },
  {
    name: 'Sweet Supari Mix',
    description: 'Sweet and refreshing betel nut mix with coconut, cardamom, and aromatic spices. A traditional favorite.',
    price: 180,
    category: 'Sweet',
    ingredients: ['Supari', 'Coconut', 'Cardamom', 'Sugar', 'Rose Essence'],
    image: '/uploads/sweet-supari.jpg',
    stock: 25,
    featured: false,
    weight: '250g',
    rating: 4.3,
    numReviews: 15
  },
  {
    name: 'Spicy Achari Mukhwas',
    description: 'Tangy and spicy pickle-flavored mukhwas with a perfect blend of Indian spices and herbs.',
    price: 140,
    category: 'Spicy',
    ingredients: ['Fennel', 'Mango Powder', 'Red Chili', 'Salt', 'Spices'],
    image: '/uploads/spicy-achari.jpg',
    stock: 40,
    featured: true,
    weight: '200g',
    rating: 4.6,
    numReviews: 10
  },
  {
    name: 'Medicinal Hing Goli',
    description: 'Traditional digestive tablets with asafoetida and other medicinal herbs for instant digestion relief.',
    price: 100,
    category: 'Medicinal',
    ingredients: ['Hing', 'Ajwain', 'Black Salt', 'Lemon', 'Herbs'],
    image: '/uploads/hing-goli.jpg',
    stock: 60,
    featured: false,
    weight: '100g',
    rating: 4.4,
    numReviews: 20
  },
  {
    name: 'Fruit Punch Mukhwas',
    description: 'Delicious fruit-flavored mukhwas with dried fruits, nuts, and natural fruit essences.',
    price: 200,
    category: 'Fruit',
    ingredients: ['Dried Fruits', 'Nuts', 'Fruit Essence', 'Sugar', 'Spices'],
    image: '/uploads/fruit-punch.jpg',
    stock: 20,
    featured: true,
    weight: '300g',
    rating: 4.8,
    numReviews: 6
  },
  {
    name: 'Royal Meetha Paan',
    description: 'Premium sweet paan preparation with betel leaf, gulkand, and exotic dry fruits fit for royalty.',
    price: 250,
    category: 'Special',
    ingredients: ['Betel Leaf', 'Gulkand', 'Dry Fruits', 'Silver Varak', 'Cardamom'],
    image: '/uploads/royal-paan.jpg',
    stock: 15,
    featured: true,
    weight: '200g',
    rating: 4.9,
    numReviews: 25
  },
  {
    name: 'Classic Elaichi Mukhwas',
    description: 'Cardamom-flavored mukhwas with a perfect balance of sweetness and aromatic spices.',
    price: 130,
    category: 'Traditional',
    ingredients: ['Cardamom', 'Fennel', 'Sugar', 'Cloves', 'Nutmeg'],
    image: '/uploads/elaichi-mukhwas.jpg',
    stock: 35,
    featured: false,
    weight: '180g',
    rating: 4.2,
    numReviews: 18
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log('Sample products inserted successfully');

    process.exit();
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
