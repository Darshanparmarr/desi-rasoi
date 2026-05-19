const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');
require('dotenv').config();

// Cycle through the available product images in frontend/public/images/products
const IMAGES = [
  '/images/products/product-1.webp',
  '/images/products/product-2.webp',
  '/images/products/product-3.webp',
  '/images/products/product-4.webp',
  '/images/products/product-5.webp',
  '/images/products/product-6.webp',
  '/images/products/product-7.webp',
];

const img = (i) => IMAGES[i % IMAGES.length];

const productsByCategory = {
  Papad: [
    { name: 'Punjabi Urad Papad', description: 'Crispy hand-rolled urad dal papad with cracked black pepper for a classic Punjabi crunch.', price: 90, ingredients: ['Urad Dal', 'Black Pepper', 'Salt', 'Asafoetida'], weight: '200g' },
    { name: 'Rajasthani Moong Papad', description: 'Authentic Rajasthani moong dal papad, sun-dried to perfection. Roast or fry for golden crispness.', price: 110, ingredients: ['Moong Dal', 'Cumin', 'Black Pepper', 'Salt'], weight: '250g' },
    { name: 'Masala Mix Papad', description: 'Spiced multi-dal papad layered with red chilli and crushed coriander seeds.', price: 120, ingredients: ['Mixed Dal', 'Red Chilli', 'Coriander Seeds', 'Salt'], weight: '200g' },
    { name: 'Garlic Lehsuni Papad', description: 'Bold garlic-flavoured papad with a sharp, savoury kick — a Gujarati family favourite.', price: 100, ingredients: ['Urad Dal', 'Garlic', 'Black Pepper', 'Salt'], weight: '200g' },
    { name: 'Jeera Papad', description: 'Light cumin-flecked papad — aromatic, mildly spiced and great as a tea-time snack.', price: 95, ingredients: ['Urad Dal', 'Cumin', 'Salt', 'Asafoetida'], weight: '200g' },
    { name: 'Sindhi Tikha Papad', description: 'Fiery Sindhi-style papad with extra red chilli — a punchy partner for cool curd rice.', price: 105, ingredients: ['Urad Dal', 'Red Chilli', 'Salt', 'Spices'], weight: '200g' },
    { name: 'Rice Chawal Papad', description: 'South Indian rice papad that puffs up beautifully when fried — light, crisp and gluten-friendly.', price: 85, ingredients: ['Rice Flour', 'Cumin', 'Green Chilli', 'Salt'], weight: '250g' },
    { name: 'Sabudana Papad', description: 'Tapioca pearl papad ideal for vrat and fasting days. Fries up into translucent crisps.', price: 130, ingredients: ['Sabudana', 'Cumin', 'Rock Salt', 'Green Chilli'], weight: '200g' },
    { name: 'Khichiya Papad', description: 'Thin Gujarati khichiya papad — roast on flame and top with chopped onion-tomato chaat.', price: 115, ingredients: ['Rice', 'Cumin', 'Salt', 'Soda'], weight: '250g' },
    { name: 'Bikaneri Mini Papad', description: 'Bite-sized Bikaneri papads — perfect for parties, lunchboxes and chaat platters.', price: 99, ingredients: ['Urad Dal', 'Black Pepper', 'Salt', 'Spices'], weight: '150g' },
  ],
  Aachar: [
    { name: 'Punjabi Mango Pickle', description: 'Classic Punjabi raw mango pickle in mustard oil with kalonji and fenugreek seeds.', price: 220, ingredients: ['Raw Mango', 'Mustard Oil', 'Fenugreek', 'Kalonji', 'Red Chilli'], weight: '500g' },
    { name: 'Stuffed Red Chilli Pickle', description: 'Plump red chillies stuffed with a tangy mustard-fennel masala. Bold, fiery and traditional.', price: 240, ingredients: ['Red Chilli', 'Mustard Seeds', 'Fennel', 'Salt', 'Mustard Oil'], weight: '400g' },
    { name: 'Lemon Nimbu Pickle', description: 'Sun-cured lemon pickle with a sweet-spicy-tangy balance — great with khichdi or curd rice.', price: 180, ingredients: ['Lemon', 'Salt', 'Turmeric', 'Red Chilli', 'Spices'], weight: '400g' },
    { name: 'Mixed Vegetable Pickle', description: 'Carrot, cauliflower, turnip and chilli pickled in mustard oil — a winter staple.', price: 210, ingredients: ['Carrot', 'Cauliflower', 'Turnip', 'Mustard Oil', 'Spices'], weight: '500g' },
    { name: 'Garlic Lehsun Pickle', description: 'Whole garlic cloves pickled in vinegar and red chilli — pungent, gutsy and delicious.', price: 230, ingredients: ['Garlic', 'Vinegar', 'Red Chilli', 'Mustard Seeds', 'Salt'], weight: '300g' },
    { name: 'Sweet Mango Chunda', description: 'Gujarati grated mango chunda with sugar, saffron and crushed black pepper.', price: 250, ingredients: ['Raw Mango', 'Sugar', 'Saffron', 'Black Pepper', 'Salt'], weight: '500g' },
    { name: 'Gujarati Methia Keri', description: 'Mango pickle with split fenugreek seeds — earthy, robust and slightly bitter in the best way.', price: 235, ingredients: ['Raw Mango', 'Methi Seeds', 'Mustard Oil', 'Red Chilli', 'Spices'], weight: '500g' },
    { name: 'Green Chilli Pickle', description: 'Slit green chillies in tangy mustard masala — a fiery condiment for parathas.', price: 190, ingredients: ['Green Chilli', 'Mustard Seeds', 'Lemon', 'Salt', 'Mustard Oil'], weight: '400g' },
    { name: 'Amla Gooseberry Pickle', description: 'Healthy Indian gooseberry pickle, naturally rich in Vitamin C with warming spices.', price: 200, ingredients: ['Amla', 'Mustard Oil', 'Fennel', 'Fenugreek', 'Red Chilli'], weight: '400g' },
    { name: 'Hyderabadi Garlic Mango', description: 'Hyderabadi-style garlic and raw-mango pickle with sesame oil — pungent and aromatic.', price: 245, ingredients: ['Raw Mango', 'Garlic', 'Sesame Oil', 'Red Chilli', 'Spices'], weight: '500g' },
  ],
  Masala: [
    { name: 'Garam Masala Premium', description: 'Stone-ground garam masala blended from whole spices — warm, fragrant, balanced.', price: 160, ingredients: ['Cinnamon', 'Cardamom', 'Clove', 'Black Pepper', 'Bay Leaf'], weight: '100g' },
    { name: 'Chai Masala', description: 'Masala chai blend with cardamom, ginger, clove and pepper — instant warmth in every cup.', price: 140, ingredients: ['Cardamom', 'Ginger', 'Clove', 'Black Pepper', 'Cinnamon'], weight: '100g' },
    { name: 'Pav Bhaji Masala', description: 'Classic Mumbai-style pav bhaji masala — rich, smoky and just the right amount of spicy.', price: 130, ingredients: ['Coriander', 'Cumin', 'Red Chilli', 'Amchur', 'Black Salt'], weight: '100g' },
    { name: 'Chole Masala', description: 'Robust chole masala with anardana for the perfect tang and dark colour.', price: 135, ingredients: ['Coriander', 'Anardana', 'Black Salt', 'Red Chilli', 'Spices'], weight: '100g' },
    { name: 'Sambar Powder', description: 'South Indian sambar powder — toor dal, coriander and curry leaves toasted and ground.', price: 145, ingredients: ['Toor Dal', 'Coriander', 'Curry Leaves', 'Red Chilli', 'Fenugreek'], weight: '200g' },
    { name: 'Kitchen King Masala', description: 'All-rounder masala for sabzis and curries — a go-to flavour booster.', price: 150, ingredients: ['Coriander', 'Cumin', 'Cardamom', 'Black Pepper', 'Spices'], weight: '100g' },
    { name: 'Biryani Masala', description: 'Aromatic biryani blend with star anise, mace and saffron-friendly spices.', price: 175, ingredients: ['Star Anise', 'Mace', 'Cardamom', 'Cinnamon', 'Bay Leaf'], weight: '100g' },
    { name: 'Pure Red Chilli Powder', description: 'Single-origin red chilli powder with a deep red colour and sharp heat.', price: 120, ingredients: ['Red Chilli'], weight: '200g' },
    { name: 'Pure Turmeric Powder', description: '100% pure haldi from Erode turmeric — vibrant yellow with high curcumin.', price: 100, ingredients: ['Turmeric'], weight: '200g' },
    { name: 'Sabji Masala', description: 'Everyday vegetable masala that adds depth to dry sabzis and stir-fries.', price: 130, ingredients: ['Coriander', 'Cumin', 'Turmeric', 'Red Chilli', 'Spices'], weight: '100g' },
  ],
  'Mouth Freshener': [
    { name: 'Traditional Saunf Mukhwas', description: 'Classic blend of fennel, sugar-coated saunf and traditional spices for a fresh after-meal finish.', price: 120, ingredients: ['Fennel Seeds', 'Sugar', 'Cardamom', 'Clove', 'Mishri'], weight: '200g' },
    { name: 'Sweet Supari Mix', description: 'Sweet betel-nut mix with coconut, cardamom and rose essence — a traditional favourite.', price: 180, ingredients: ['Supari', 'Coconut', 'Cardamom', 'Sugar', 'Rose Essence'], weight: '250g' },
    { name: 'Spicy Achari Mukhwas', description: 'Tangy, spicy pickle-flavoured mukhwas with mango powder and red chilli.', price: 140, ingredients: ['Fennel', 'Mango Powder', 'Red Chilli', 'Salt', 'Spices'], weight: '200g' },
    { name: 'Royal Meetha Paan', description: 'Premium meetha paan-style mukhwas with gulkand, dry fruits and silver varak.', price: 250, ingredients: ['Betel Leaf', 'Gulkand', 'Dry Fruits', 'Silver Varak', 'Cardamom'], weight: '200g' },
    { name: 'Classic Elaichi Mukhwas', description: 'Cardamom-led mukhwas with the perfect balance of sweet and aromatic spice.', price: 130, ingredients: ['Cardamom', 'Fennel', 'Sugar', 'Cloves', 'Nutmeg'], weight: '180g' },
    { name: 'Dhana Dal Mukhwas', description: 'Roasted coriander-seed split mukhwas — light, crunchy and naturally cooling.', price: 110, ingredients: ['Coriander Seeds', 'Salt', 'Citric Acid'], weight: '200g' },
    { name: 'Rajwadi Paan Mukhwas', description: 'Royal-style rajwadi paan mix loaded with dry fruits, mishri and rose.', price: 220, ingredients: ['Dry Fruits', 'Mishri', 'Rose Petals', 'Cardamom', 'Saunf'], weight: '200g' },
    { name: 'Calcutta Meetha Paan', description: 'Sweet Bengali-style paan mukhwas with kattha, gulkand and aniseed.', price: 210, ingredients: ['Gulkand', 'Kattha', 'Aniseed', 'Coconut', 'Cardamom'], weight: '200g' },
    { name: 'Anardana Goli', description: 'Tangy pomegranate-seed goli — a sweet-sour treat that doubles as a digestive.', price: 95, ingredients: ['Anardana', 'Sugar', 'Black Salt', 'Spices'], weight: '150g' },
    { name: 'Tulsi Saunf Mukhwas', description: 'Cooling tulsi-and-fennel mukhwas with a hint of mint — refreshing and wholesome.', price: 125, ingredients: ['Fennel', 'Tulsi', 'Mint', 'Mishri', 'Cardamom'], weight: '200g' },
  ],
  Snacks: [
    { name: 'Bikaneri Bhujia', description: 'Crispy moth-bean and besan bhujia from Bikaner — the original namkeen classic.', price: 150, ingredients: ['Moth Beans', 'Besan', 'Spices', 'Oil', 'Salt'], weight: '400g' },
    { name: 'Aloo Bhujia', description: 'Light, spiced potato sev with a crisp golden bite. Goes with everything.', price: 140, ingredients: ['Potato', 'Besan', 'Spices', 'Oil', 'Salt'], weight: '400g' },
    { name: 'Khatta Meetha Mix', description: 'Sweet-and-tangy namkeen mix with sev, raisins and crispy boondi.', price: 160, ingredients: ['Besan', 'Raisins', 'Sugar', 'Spices', 'Oil'], weight: '400g' },
    { name: 'Masala Peanuts', description: 'Crunchy besan-coated masala peanuts — a perfect partner for chai.', price: 130, ingredients: ['Peanuts', 'Besan', 'Spices', 'Salt', 'Oil'], weight: '300g' },
    { name: 'Methi Mathri', description: 'Flaky fenugreek mathri — North Indian tea-time biscuits with a savoury crunch.', price: 170, ingredients: ['Wheat Flour', 'Methi Leaves', 'Ajwain', 'Oil', 'Salt'], weight: '300g' },
    { name: 'Chakli', description: 'Spiral rice-flour chakli with sesame and cumin — crisp, crunchy and addictive.', price: 155, ingredients: ['Rice Flour', 'Besan', 'Sesame', 'Cumin', 'Spices'], weight: '300g' },
    { name: 'Khakhra Masala', description: 'Roasted whole-wheat khakhra dusted with masala — light and travel-friendly.', price: 145, ingredients: ['Wheat Flour', 'Spices', 'Oil', 'Salt'], weight: '200g' },
    { name: 'Sev Murmura', description: 'Puffed-rice and sev mix with peanuts and curry leaves — Mumbai chivda style.', price: 135, ingredients: ['Murmura', 'Sev', 'Peanuts', 'Curry Leaves', 'Spices'], weight: '400g' },
    { name: 'Banana Chips', description: 'Kerala-style coconut-oil banana chips — crisp, salted and never greasy.', price: 165, ingredients: ['Banana', 'Coconut Oil', 'Salt'], weight: '300g' },
    { name: 'Roasted Makhana', description: 'Roasted fox-nuts in pink salt and pepper — a guilt-free crunchy snack.', price: 220, ingredients: ['Makhana', 'Pink Salt', 'Black Pepper', 'Ghee'], weight: '150g' },
  ],
  Sweets: [
    { name: 'Kaju Katli', description: 'Diamond-cut cashew fudge with a delicate silver-leaf finish — a festive favourite.', price: 650, ingredients: ['Cashew', 'Sugar', 'Ghee', 'Silver Varak'], weight: '500g' },
    { name: 'Besan Ladoo', description: 'Slow-roasted besan ladoos with ghee and cardamom — soft, melt-in-mouth, traditional.', price: 380, ingredients: ['Besan', 'Ghee', 'Sugar', 'Cardamom'], weight: '500g' },
    { name: 'Motichoor Ladoo', description: 'Saffron-tinted motichoor ladoos made of fine boondi pearls in sugar syrup.', price: 420, ingredients: ['Besan', 'Sugar', 'Ghee', 'Saffron', 'Cardamom'], weight: '500g' },
    { name: 'Soan Papdi', description: 'Flaky, layered soan papdi with cardamom — light, airy and delicately sweet.', price: 280, ingredients: ['Besan', 'Sugar', 'Ghee', 'Cardamom', 'Pistachio'], weight: '500g' },
    { name: 'Gulab Jamun (Tinned)', description: 'Soft khoya gulab jamuns soaked in rose-cardamom syrup — ready to warm and serve.', price: 300, ingredients: ['Khoya', 'Sugar', 'Rose Water', 'Cardamom'], weight: '1kg' },
    { name: 'Rasgulla (Tinned)', description: 'Spongy chenna rasgullas in light cardamom syrup — Bengali classic in a tin.', price: 260, ingredients: ['Chenna', 'Sugar', 'Cardamom', 'Rose Water'], weight: '1kg' },
    { name: 'Mysore Pak', description: 'Rich ghee-laden Mysore pak with a porous, melt-in-mouth texture.', price: 450, ingredients: ['Besan', 'Ghee', 'Sugar'], weight: '500g' },
    { name: 'Dry Fruit Halwa', description: 'Slow-cooked halwa packed with almond, cashew and pistachio — festive and indulgent.', price: 520, ingredients: ['Almond', 'Cashew', 'Pistachio', 'Ghee', 'Sugar'], weight: '500g' },
    { name: 'Anjeer Barfi', description: 'Sugar-free fig and dry-fruit barfi — naturally sweet, wholesome and rich.', price: 580, ingredients: ['Fig', 'Almond', 'Cashew', 'Pistachio', 'Cardamom'], weight: '400g' },
    { name: 'Coconut Barfi', description: 'Soft coconut barfi with khoya and cardamom — a light, fragrant Indian sweet.', price: 360, ingredients: ['Coconut', 'Khoya', 'Sugar', 'Cardamom', 'Ghee'], weight: '500g' },
  ],
  Other: [
    { name: 'Pure Cow Ghee', description: 'Bilona-method pure cow ghee — golden, granular and aromatic.', price: 850, ingredients: ['Cow Milk'], weight: '500ml' },
    { name: 'Mango Murabba', description: 'Slow-cooked sweet mango murabba in saffron syrup — a Punjabi household tradition.', price: 320, ingredients: ['Raw Mango', 'Sugar', 'Saffron', 'Cardamom'], weight: '500g' },
    { name: 'Amla Murabba', description: 'Sweet preserved amla in honey-style syrup — wholesome and naturally vitamin-rich.', price: 290, ingredients: ['Amla', 'Sugar', 'Cardamom'], weight: '500g' },
    { name: 'Gulkand', description: 'Traditional rose-petal preserve — fragrant, cooling and a great paan filler.', price: 240, ingredients: ['Rose Petals', 'Sugar', 'Cardamom'], weight: '400g' },
    { name: 'Dry Fruit Mix', description: 'Premium mixed dry fruits — almonds, cashews, raisins, pistachios and walnuts.', price: 750, ingredients: ['Almond', 'Cashew', 'Raisin', 'Pistachio', 'Walnut'], weight: '500g' },
    { name: 'Organic Honey', description: 'Raw, unprocessed multi-flora honey straight from the apiary — pure and unfiltered.', price: 480, ingredients: ['Honey'], weight: '500g' },
    { name: 'Chyawanprash', description: 'Traditional Ayurvedic chyawanprash with amla and 40+ herbs — a daily wellness staple.', price: 420, ingredients: ['Amla', 'Herbs', 'Ghee', 'Honey', 'Spices'], weight: '500g' },
    { name: 'Saffron (Kesar)', description: 'Premium Kashmiri saffron with deep colour, long threads and a rich aroma.', price: 950, ingredients: ['Saffron'], weight: '2g' },
    { name: 'Cold-Pressed Mustard Oil', description: 'Wood-pressed kachi ghani mustard oil — pungent, golden and full of character.', price: 320, ingredients: ['Mustard Seeds'], weight: '1L' },
    { name: 'Jaggery (Gur)', description: 'Traditional sugarcane jaggery — natural, mineral-rich and chemical-free.', price: 180, ingredients: ['Sugarcane'], weight: '1kg' },
  ],
};

const buildProducts = () => {
  const all = [];
  let imgIdx = 0;
  for (const [category, items] of Object.entries(productsByCategory)) {
    items.forEach((p, i) => {
      all.push({
        ...p,
        category,
        image: img(imgIdx++),
        stock: 20 + ((i * 7) % 50),
        featured: i % 4 === 0,
        rating: Number((4 + ((i * 13) % 10) / 10).toFixed(1)),
        numReviews: 5 + ((i * 11) % 30),
      });
    });
  }
  return all;
};

const seed = async () => {
  try {
    if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI missing in .env');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const wipe = process.argv.includes('--wipe');
    if (wipe) {
      await Product.deleteMany({});
      console.log('Cleared existing products (--wipe flag)');
    }

    const products = buildProducts();

    // Make sure a Category document exists for each so the /categories page lights up.
    for (const name of Object.keys(productsByCategory)) {
      await Category.updateOne(
        { name },
        { $setOnInsert: { name, description: `${name} products`, isActive: true } },
        { upsert: true }
      );
    }
    console.log(`Ensured ${Object.keys(productsByCategory).length} categories exist`);

    const inserted = await Product.insertMany(products);
    console.log(`Inserted ${inserted.length} products (10 per category x ${Object.keys(productsByCategory).length} categories)`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error.message);
    process.exit(1);
  }
};

seed();
