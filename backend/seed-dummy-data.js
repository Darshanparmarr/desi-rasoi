/**
 * Seeds the database with the 4 supported categories (Aachar, Fruit, Mukhwas, Masala)
 * and 16 dummy products (4 per category) using locally-stored, logo-free product photos.
 *
 * Run:  node backend/seed-dummy-data.js
 */
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Product = require('./models/Product');
const Category = require('./models/Category');

const PUBLIC_IMAGES_DIR = path.join(__dirname, '..', 'frontend', 'public');

const CATEGORIES = [
  {
    name: 'Aachar',
    description: 'Slow-pickled in mustard oil with sun-ripened spices — the soul of an Indian thali.',
    image: '/images/products/category-aachar.jpg',
  },
  {
    name: 'Fruit',
    description: 'Naturally sun-dried fruits & berries — chewy, sweet, no added sugar.',
    image: '/images/products/category-fruit.jpg',
  },
  {
    name: 'Mukhwas',
    description: 'Aromatic after-meal mixes of fennel, sesame & herbs — a cool finish to every meal.',
    image: '/images/products/category-mukhwas.jpg',
  },
  {
    name: 'Masala',
    description: 'Stone-ground spice blends from heirloom recipes — small-batch, never irradiated.',
    image: '/images/products/category-masala.jpg',
  },
];

const PRODUCTS = [
  // ---------- Aachar ----------
  {
    name: 'Punjabi Mango Aachar',
    description:
      'Sun-cured raw mango pieces matured in cold-pressed mustard oil with whole spices. Tangy, fiery, deeply aromatic — exactly the way it has been pickled in Punjabi kitchens for generations.',
    price: 249,
    category: 'Aachar',
    image: '/images/products/aachar-1.jpg',
    images: ['/images/products/aachar-1.jpg', '/images/products/aachar-3.jpg'],
    ingredients: ['Raw mango', 'Mustard oil', 'Fenugreek', 'Fennel', 'Red chilli', 'Asafoetida', 'Salt'],
    stock: 60,
    weight: '400g',
    featured: true,
    rating: 4.8,
    numReviews: 128,
  },
  {
    name: 'Green Chilli Aachar',
    description:
      'Hand-slit green chillies stuffed with crushed mustard and toasted spices, then fermented till they bite back. Ideal with parathas, dal-rice, or a hot khichdi.',
    price: 199,
    category: 'Aachar',
    image: '/images/products/aachar-2.jpg',
    images: ['/images/products/aachar-2.jpg'],
    ingredients: ['Green chilli', 'Yellow mustard', 'Mustard oil', 'Lemon juice', 'Salt', 'Turmeric'],
    stock: 45,
    weight: '300g',
    featured: true,
    rating: 4.6,
    numReviews: 84,
  },
  {
    name: 'Sweet Lemon Aachar',
    description:
      'Soft, sun-cooked lemon wedges in a glossy sweet-spicy syrup. A perfect balance of sour, sweet and warm spice — wonderful with curd rice or as a chutney.',
    price: 229,
    category: 'Aachar',
    image: '/images/products/aachar-3.jpg',
    images: ['/images/products/aachar-3.jpg'],
    ingredients: ['Lemon', 'Jaggery', 'Black salt', 'Roasted cumin', 'Red chilli', 'Cardamom'],
    stock: 50,
    weight: '350g',
    featured: false,
    rating: 4.7,
    numReviews: 67,
  },
  {
    name: 'Mixed Veg Spicy Aachar',
    description:
      'A vibrant mix of carrot, lotus stem, raw turmeric and chillies cured the traditional way. Bold, smoky, packed with character — pairs with everything.',
    price: 269,
    category: 'Aachar',
    image: '/images/products/aachar-4.jpg',
    images: ['/images/products/aachar-4.jpg'],
    ingredients: ['Carrot', 'Lotus stem', 'Raw turmeric', 'Green chilli', 'Mustard oil', 'Fennel', 'Salt'],
    stock: 40,
    weight: '400g',
    featured: true,
    rating: 4.9,
    numReviews: 102,
  },
  {
    name: 'Lemon-Ginger Aachar',
    description:
      'Zesty lemon wedges and fresh ginger pickled with mustard seeds and a touch of jaggery. Bright, warming and naturally digestive.',
    price: 219,
    category: 'Aachar',
    image: '/images/products/aachar-1.jpg',
    images: ['/images/products/aachar-1.jpg', '/images/products/aachar-3.jpg'],
    ingredients: ['Lemon', 'Ginger', 'Mustard seeds', 'Jaggery', 'Black salt', 'Turmeric', 'Asafoetida'],
    stock: 55,
    weight: '350g',
    featured: false,
    rating: 4.5,
    numReviews: 49,
  },
  {
    name: 'Stuffed Red Chilli Aachar',
    description:
      'Plump red chillies hand-stuffed with crushed yellow mustard and toasted spices, slow-matured in mustard oil. Pungent, smoky, deeply flavoursome.',
    price: 259,
    category: 'Aachar',
    image: '/images/products/aachar-2.jpg',
    images: ['/images/products/aachar-2.jpg', '/images/products/aachar-4.jpg'],
    ingredients: ['Red chilli', 'Yellow mustard', 'Fennel', 'Mustard oil', 'Kalonji', 'Salt'],
    stock: 40,
    weight: '400g',
    featured: true,
    rating: 4.7,
    numReviews: 76,
  },
  {
    name: 'Garlic Lehsun Aachar',
    description:
      'Whole garlic cloves cured in tangy vinegar, red chilli and mustard oil. Pungent, gutsy and brilliant with parathas or curd-rice.',
    price: 239,
    category: 'Aachar',
    image: '/images/products/aachar-3.jpg',
    images: ['/images/products/aachar-3.jpg', '/images/products/aachar-1.jpg'],
    ingredients: ['Garlic', 'Vinegar', 'Red chilli', 'Mustard seeds', 'Mustard oil', 'Salt'],
    stock: 50,
    weight: '350g',
    featured: false,
    rating: 4.6,
    numReviews: 61,
  },
  {
    name: 'Amla Aachar',
    description:
      'Indian gooseberry pickle in warm spices and mustard oil — naturally rich in Vitamin C and traditionally believed to aid digestion.',
    price: 209,
    category: 'Aachar',
    image: '/images/products/aachar-4.jpg',
    images: ['/images/products/aachar-4.jpg', '/images/products/aachar-2.jpg'],
    ingredients: ['Amla', 'Mustard oil', 'Fennel', 'Fenugreek', 'Red chilli', 'Salt'],
    stock: 60,
    weight: '350g',
    featured: false,
    rating: 4.4,
    numReviews: 38,
  },
  {
    name: 'Methia Keri',
    description:
      'A classic Gujarati raw-mango pickle with split fenugreek seeds — earthy, robust and slightly bitter in the best way. Ages beautifully.',
    price: 279,
    category: 'Aachar',
    image: '/images/products/aachar-1.jpg',
    images: ['/images/products/aachar-1.jpg', '/images/products/aachar-4.jpg'],
    ingredients: ['Raw mango', 'Methi seeds', 'Mustard oil', 'Red chilli', 'Turmeric', 'Salt'],
    stock: 45,
    weight: '500g',
    featured: true,
    rating: 4.8,
    numReviews: 91,
  },
  {
    name: 'Hyderabadi Avakaya',
    description:
      'Bold Andhra-style raw-mango pickle in sesame oil with whole mustard, fenugreek and garlic — fiery, oily and unmistakably South-Indian.',
    price: 289,
    category: 'Aachar',
    image: '/images/products/aachar-2.jpg',
    images: ['/images/products/aachar-2.jpg', '/images/products/aachar-3.jpg'],
    ingredients: ['Raw mango', 'Sesame oil', 'Mustard', 'Fenugreek', 'Red chilli', 'Garlic', 'Salt'],
    stock: 35,
    weight: '500g',
    featured: false,
    rating: 4.6,
    numReviews: 54,
  },

  // ---------- Fruit ----------
  {
    name: 'Premium Dried Apricots',
    description:
      'Plump, soft Hunza apricots — naturally sun-dried, no sulphur, no added sugar. A natural source of iron and fibre for a wholesome snack.',
    price: 549,
    category: 'Fruit',
    image: '/images/products/fruit-4.jpg',
    images: ['/images/products/fruit-4.jpg'],
    ingredients: ['100% sun-dried apricots'],
    stock: 75,
    weight: '250g',
    featured: true,
    rating: 4.9,
    numReviews: 156,
  },
  {
    name: 'Trail Berry Mix',
    description:
      'A handpicked blend of dried strawberries, blueberries, cranberries and figs. Chewy, sweet-tart, and perfect for breakfast bowls or a midday lift.',
    price: 499,
    category: 'Fruit',
    image: '/images/products/fruit-1.jpg',
    images: ['/images/products/fruit-1.jpg'],
    ingredients: ['Dried strawberry', 'Blueberry', 'Cranberry', 'Fig', 'Sunflower oil (trace)'],
    stock: 60,
    weight: '200g',
    featured: true,
    rating: 4.7,
    numReviews: 92,
  },
  {
    name: 'Tropical Fruit Medley',
    description:
      'Sun-dried mango, pineapple, papaya and kiwi tossed together for a tropical bite. No added sugar, no preservatives — just real fruit, dehydrated.',
    price: 449,
    category: 'Fruit',
    image: '/images/products/fruit-2.jpg',
    images: ['/images/products/fruit-2.jpg'],
    ingredients: ['Mango', 'Pineapple', 'Papaya', 'Kiwi'],
    stock: 55,
    weight: '200g',
    featured: false,
    rating: 4.6,
    numReviews: 71,
  },
  {
    name: 'Festive Dry Fruit Box',
    description:
      'A premium gift-ready assortment of dried apricots, dates, figs and berries. Perfect for festivals, gifting, or stocking the pantry.',
    price: 899,
    category: 'Fruit',
    image: '/images/products/fruit-3.jpg',
    images: ['/images/products/fruit-3.jpg'],
    ingredients: ['Apricot', 'Dates', 'Fig', 'Cranberry', 'Apple slices'],
    stock: 35,
    weight: '500g',
    featured: true,
    rating: 4.8,
    numReviews: 211,
  },
  {
    name: 'Royal Dates & Almond Mix',
    description:
      'Soft Medjool-style dates layered with whole roasted almonds — naturally sweet, mineral-rich and quietly energising. A wholesome any-time snack.',
    price: 599,
    category: 'Fruit',
    image: '/images/products/fruit-1.jpg',
    images: ['/images/products/fruit-1.jpg', '/images/products/fruit-3.jpg'],
    ingredients: ['Dates', 'Whole almonds'],
    stock: 50,
    weight: '300g',
    featured: false,
    rating: 4.7,
    numReviews: 88,
  },
  {
    name: 'Sun-Dried Black Raisins',
    description:
      'Plump, seedless black raisins, naturally sun-dried on the vine. Subtly sweet with a hint of tartness — great for baking and snacking.',
    price: 329,
    category: 'Fruit',
    image: '/images/products/fruit-2.jpg',
    images: ['/images/products/fruit-2.jpg', '/images/products/fruit-4.jpg'],
    ingredients: ['100% sun-dried black grapes'],
    stock: 70,
    weight: '250g',
    featured: false,
    rating: 4.5,
    numReviews: 64,
  },
  {
    name: 'Anjeer Crown (Premium Figs)',
    description:
      'Soft, golden Afghan-style figs — naturally sweet, naturally chewy, no added sugar. Excellent with cheese or as a wholesome dessert.',
    price: 749,
    category: 'Fruit',
    image: '/images/products/fruit-3.jpg',
    images: ['/images/products/fruit-3.jpg', '/images/products/fruit-1.jpg'],
    ingredients: ['100% sun-dried figs'],
    stock: 40,
    weight: '250g',
    featured: true,
    rating: 4.9,
    numReviews: 137,
  },
  {
    name: 'Cranberry Crunch',
    description:
      'Whole, lightly sweetened dried cranberries — tart, chewy and perfect for breakfast bowls, salads or trail mixes.',
    price: 379,
    category: 'Fruit',
    image: '/images/products/fruit-4.jpg',
    images: ['/images/products/fruit-4.jpg', '/images/products/fruit-2.jpg'],
    ingredients: ['Cranberries', 'Apple juice concentrate', 'Sunflower oil (trace)'],
    stock: 65,
    weight: '200g',
    featured: false,
    rating: 4.4,
    numReviews: 52,
  },
  {
    name: 'Cashew & Walnut Halves',
    description:
      'A balanced mix of whole cashews and walnut halves — buttery, brain-friendly and great straight from the jar.',
    price: 699,
    category: 'Fruit',
    image: '/images/products/fruit-1.jpg',
    images: ['/images/products/fruit-1.jpg', '/images/products/fruit-4.jpg'],
    ingredients: ['Cashew', 'Walnut'],
    stock: 55,
    weight: '300g',
    featured: true,
    rating: 4.8,
    numReviews: 119,
  },
  {
    name: 'Pistachio Slivers (Roasted)',
    description:
      'Lightly roasted, gently salted pistachio slivers — perfect for sprinkling on desserts, biryanis or salads, or eating by the handful.',
    price: 829,
    category: 'Fruit',
    image: '/images/products/fruit-2.jpg',
    images: ['/images/products/fruit-2.jpg', '/images/products/fruit-3.jpg'],
    ingredients: ['Pistachio', 'Pink salt (trace)'],
    stock: 45,
    weight: '250g',
    featured: false,
    rating: 4.7,
    numReviews: 73,
  },

  // ---------- Mukhwas ----------
  {
    name: 'Saunf Mukhwas',
    description:
      'Sweetened, lightly minted fennel seeds — the classic after-meal mukhwas. Refreshing, mildly cooling, and great for digestion.',
    price: 149,
    category: 'Mukhwas',
    image: '/images/products/mukhwas-1.jpg',
    images: ['/images/products/mukhwas-1.jpg'],
    ingredients: ['Fennel seeds', 'Sugar coating', 'Mint extract'],
    stock: 90,
    weight: '200g',
    featured: true,
    rating: 4.7,
    numReviews: 184,
  },
  {
    name: 'Mixed Mukhwas Medley',
    description:
      'A lively after-meal blend of fennel, coriander seeds, sesame and rock sugar — colourful, crunchy, and gently sweet.',
    price: 179,
    category: 'Mukhwas',
    image: '/images/products/mukhwas-2.jpg',
    images: ['/images/products/mukhwas-2.jpg'],
    ingredients: ['Fennel', 'Coriander seeds', 'Sesame', 'Rock sugar', 'Cardamom'],
    stock: 70,
    weight: '200g',
    featured: true,
    rating: 4.8,
    numReviews: 142,
  },
  {
    name: 'Cardamom Mukhwas Mix',
    description:
      'Fragrant green cardamom paired with toasted fennel and a hint of cinnamon — a luxurious finish to a heavy meal.',
    price: 199,
    category: 'Mukhwas',
    image: '/images/products/mukhwas-3.jpg',
    images: ['/images/products/mukhwas-3.jpg'],
    ingredients: ['Green cardamom', 'Fennel', 'Cinnamon', 'Rock sugar'],
    stock: 55,
    weight: '180g',
    featured: false,
    rating: 4.6,
    numReviews: 73,
  },
  {
    name: 'Spiced Saunf Supari',
    description:
      'A bold, lightly spiced mukhwas with fennel, sesame and a touch of black salt — perfect when you want flavour, not sweetness.',
    price: 169,
    category: 'Mukhwas',
    image: '/images/products/mukhwas-4.jpg',
    images: ['/images/products/mukhwas-4.jpg'],
    ingredients: ['Fennel', 'Sesame', 'Black salt', 'Mustard', 'Cardamom'],
    stock: 65,
    weight: '180g',
    featured: false,
    rating: 4.5,
    numReviews: 58,
  },
  {
    name: 'Anardana Goli',
    description:
      'Tangy pomegranate-seed lozenges with black salt and roasted cumin — a sweet-sour treat that doubles as a digestive.',
    price: 139,
    category: 'Mukhwas',
    image: '/images/products/mukhwas-1.jpg',
    images: ['/images/products/mukhwas-1.jpg', '/images/products/mukhwas-3.jpg'],
    ingredients: ['Pomegranate seeds', 'Sugar', 'Black salt', 'Cumin', 'Spices'],
    stock: 80,
    weight: '150g',
    featured: false,
    rating: 4.6,
    numReviews: 91,
  },
  {
    name: 'Tulsi-Mint Mukhwas',
    description:
      'A cooling blend of holy basil, mint and fennel coated in light sugar — refreshing and gently digestive.',
    price: 159,
    category: 'Mukhwas',
    image: '/images/products/mukhwas-2.jpg',
    images: ['/images/products/mukhwas-2.jpg', '/images/products/mukhwas-4.jpg'],
    ingredients: ['Fennel', 'Tulsi', 'Mint', 'Mishri', 'Cardamom'],
    stock: 70,
    weight: '180g',
    featured: false,
    rating: 4.5,
    numReviews: 67,
  },
  {
    name: 'Coconut Sweet Mukhwas',
    description:
      'Toasted coconut flakes tossed with fennel, rose petals and rock sugar — fragrant, floral and lightly sweet.',
    price: 189,
    category: 'Mukhwas',
    image: '/images/products/mukhwas-3.jpg',
    images: ['/images/products/mukhwas-3.jpg', '/images/products/mukhwas-1.jpg'],
    ingredients: ['Coconut', 'Fennel', 'Rose petals', 'Rock sugar', 'Cardamom'],
    stock: 60,
    weight: '200g',
    featured: true,
    rating: 4.7,
    numReviews: 102,
  },
  {
    name: 'Khatta-Meetha Saunf',
    description:
      'A sweet-and-sour after-meal mix of fennel, dry mango powder, black salt and crystal sugar — tangy, refreshing, addictive.',
    price: 149,
    category: 'Mukhwas',
    image: '/images/products/mukhwas-4.jpg',
    images: ['/images/products/mukhwas-4.jpg', '/images/products/mukhwas-2.jpg'],
    ingredients: ['Fennel', 'Amchur', 'Black salt', 'Rock sugar', 'Cumin'],
    stock: 85,
    weight: '200g',
    featured: false,
    rating: 4.6,
    numReviews: 78,
  },
  {
    name: 'Dhana Dal Mukhwas',
    description:
      'Roasted coriander-seed splits in a light crunchy coating — naturally cooling, lightly salted, and great for digestion.',
    price: 129,
    category: 'Mukhwas',
    image: '/images/products/mukhwas-1.jpg',
    images: ['/images/products/mukhwas-1.jpg', '/images/products/mukhwas-4.jpg'],
    ingredients: ['Coriander seeds', 'Salt', 'Citric acid'],
    stock: 95,
    weight: '200g',
    featured: false,
    rating: 4.5,
    numReviews: 56,
  },
  {
    name: 'Rajwadi Meetha Paan Mukhwas',
    description:
      'A royal paan-style mukhwas loaded with gulkand, dry fruits, mishri and silver varak — luxurious and festive.',
    price: 249,
    category: 'Mukhwas',
    image: '/images/products/mukhwas-2.jpg',
    images: ['/images/products/mukhwas-2.jpg', '/images/products/mukhwas-3.jpg'],
    ingredients: ['Gulkand', 'Dry fruits', 'Mishri', 'Silver varak', 'Cardamom', 'Fennel'],
    stock: 35,
    weight: '200g',
    featured: true,
    rating: 4.9,
    numReviews: 188,
  },

  // ---------- Masala ----------
  {
    name: 'Whole Spice Thali',
    description:
      'A curated thali of seven essential whole spices — cumin, mustard, coriander, fenugreek, dried red chilli, urad dal & ginger-garlic. Stone-clean, never irradiated.',
    price: 399,
    category: 'Masala',
    image: '/images/products/masala-1.jpg',
    images: ['/images/products/masala-1.jpg'],
    ingredients: ['Cumin', 'Mustard', 'Coriander', 'Fenugreek', 'Red chilli', 'Urad dal'],
    stock: 40,
    weight: '350g',
    featured: true,
    rating: 4.8,
    numReviews: 119,
  },
  {
    name: 'Garam Masala Heritage Blend',
    description:
      'Stone-ground in small batches with cardamom, cinnamon, clove, mace and black pepper. Warm, aromatic, and balanced — the kind of garam masala that finishes a curry, not overwhelms it.',
    price: 229,
    category: 'Masala',
    image: '/images/products/masala-2.jpg',
    images: ['/images/products/masala-2.jpg'],
    ingredients: ['Cardamom', 'Cinnamon', 'Clove', 'Mace', 'Black pepper', 'Bay leaf'],
    stock: 80,
    weight: '100g',
    featured: true,
    rating: 4.9,
    numReviews: 234,
  },
  {
    name: 'Chaat Masala Special',
    description:
      'Tangy, smoky, salty and a little fiery — our chaat masala wakes up fruits, salads, drinks and street snacks alike.',
    price: 159,
    category: 'Masala',
    image: '/images/products/masala-3.jpg',
    images: ['/images/products/masala-3.jpg'],
    ingredients: ['Black salt', 'Cumin', 'Mango powder', 'Asafoetida', 'Mint', 'Black pepper'],
    stock: 95,
    weight: '100g',
    featured: false,
    rating: 4.7,
    numReviews: 168,
  },
  {
    name: 'Tri-Color Powder Trio',
    description:
      'A trio of pure ground turmeric, Kashmiri red chilli and roasted coriander. Naturally vibrant, with no added colour or starch.',
    price: 299,
    category: 'Masala',
    image: '/images/products/masala-4.jpg',
    images: ['/images/products/masala-4.jpg'],
    ingredients: ['Turmeric', 'Kashmiri red chilli', 'Coriander'],
    stock: 70,
    weight: '300g',
    featured: true,
    rating: 4.8,
    numReviews: 201,
  },
  {
    name: 'Pav Bhaji Masala',
    description:
      'Classic Mumbai pav bhaji masala — rich, smoky and street-style spicy. Stir into mashed veg for instant bhaji magic.',
    price: 149,
    category: 'Masala',
    image: '/images/products/masala-1.jpg',
    images: ['/images/products/masala-1.jpg', '/images/products/masala-3.jpg'],
    ingredients: ['Coriander', 'Cumin', 'Red chilli', 'Amchur', 'Black salt', 'Spices'],
    stock: 75,
    weight: '100g',
    featured: false,
    rating: 4.7,
    numReviews: 132,
  },
  {
    name: 'Chai Masala',
    description:
      'A warming chai blend of cardamom, ginger, clove and black pepper — instant warmth in every cup.',
    price: 169,
    category: 'Masala',
    image: '/images/products/masala-2.jpg',
    images: ['/images/products/masala-2.jpg', '/images/products/masala-4.jpg'],
    ingredients: ['Cardamom', 'Ginger', 'Clove', 'Black pepper', 'Cinnamon', 'Nutmeg'],
    stock: 85,
    weight: '80g',
    featured: true,
    rating: 4.8,
    numReviews: 167,
  },
  {
    name: 'Sambar Powder',
    description:
      'Toor dal, coriander and curry leaves toasted and stone-ground — the authentic flavour of South-Indian sambar in a single jar.',
    price: 179,
    category: 'Masala',
    image: '/images/products/masala-3.jpg',
    images: ['/images/products/masala-3.jpg', '/images/products/masala-1.jpg'],
    ingredients: ['Toor dal', 'Coriander', 'Curry leaves', 'Red chilli', 'Fenugreek', 'Asafoetida'],
    stock: 60,
    weight: '200g',
    featured: false,
    rating: 4.7,
    numReviews: 88,
  },
  {
    name: 'Biryani Heritage Mix',
    description:
      'An aromatic biryani blend with star anise, mace, dried rose and saffron-friendly spices — for unforgettable biryanis and pulaos.',
    price: 219,
    category: 'Masala',
    image: '/images/products/masala-4.jpg',
    images: ['/images/products/masala-4.jpg', '/images/products/masala-2.jpg'],
    ingredients: ['Star anise', 'Mace', 'Cardamom', 'Cinnamon', 'Bay leaf', 'Dried rose petals'],
    stock: 50,
    weight: '100g',
    featured: true,
    rating: 4.9,
    numReviews: 154,
  },
  {
    name: 'Pure Erode Turmeric',
    description:
      'Single-origin Erode turmeric, vibrant yellow with high curcumin. Stone-ground in small batches — no starch, no fillers, no colour added.',
    price: 139,
    category: 'Masala',
    image: '/images/products/masala-1.jpg',
    images: ['/images/products/masala-1.jpg', '/images/products/masala-4.jpg'],
    ingredients: ['Turmeric'],
    stock: 100,
    weight: '250g',
    featured: false,
    rating: 4.8,
    numReviews: 211,
  },
  {
    name: 'Kashmiri Chilli Powder',
    description:
      'Deep-red Kashmiri chilli — mild heat, brilliant colour. The secret behind rich, glossy curries and tandoori rubs.',
    price: 189,
    category: 'Masala',
    image: '/images/products/masala-2.jpg',
    images: ['/images/products/masala-2.jpg', '/images/products/masala-3.jpg'],
    ingredients: ['Kashmiri red chilli'],
    stock: 70,
    weight: '200g',
    featured: false,
    rating: 4.7,
    numReviews: 142,
  },
];

function verifyImagesExist() {
  const referenced = new Set();
  for (const c of CATEGORIES) if (c.image) referenced.add(c.image);
  for (const p of PRODUCTS) {
    if (p.image) referenced.add(p.image);
    for (const img of p.images || []) referenced.add(img);
  }
  const missing = [];
  for (const imgPath of referenced) {
    if (!imgPath.startsWith('/images/')) continue;
    const abs = path.join(PUBLIC_IMAGES_DIR, imgPath);
    if (!fs.existsSync(abs)) missing.push(imgPath);
  }
  return { referenced, missing };
}

async function run() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI missing in backend/.env');
    process.exit(1);
  }

  const { referenced, missing } = verifyImagesExist();
  if (missing.length) {
    console.error(`Missing ${missing.length} image file(s) under frontend/public:`);
    for (const m of missing) console.error('  -', m);
    console.error('Aborting before touching the database.');
    process.exit(1);
  }
  console.log(`Image check OK — ${referenced.size} referenced files all present.`);

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB:', process.env.MONGODB_URI);

  await Category.deleteMany({});
  const insertedCats = await Category.insertMany(CATEGORIES);
  console.log(`Seeded ${insertedCats.length} categories`);

  await Product.deleteMany({});
  const insertedProducts = await Product.insertMany(PRODUCTS);
  console.log(`Seeded ${insertedProducts.length} products`);

  const byCat = insertedProducts.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});
  console.log('Per-category counts:', byCat);
  console.log(`Featured products: ${insertedProducts.filter((p) => p.featured).length}`);

  await mongoose.disconnect();
  console.log('Done.');
}

run().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
