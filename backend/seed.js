const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    const products = [
      {
        name: 'Royal Solitaire Diamond Ring',
        description: 'Exquisitely cut brilliant solitaire diamond set on a polished 18K white gold band. A statement of timeless love and unmatched sparkle.',
        price: 49999.00,
        category: 'Rings',
        stock: 12,
        imageUrl: 'https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg?auto=compress&cs=tinysrgb&w=800',
        ratings: 4.9,
        numReviews: 38
      },
      {
        name: 'Emerald & Gold Pendant Necklace',
        description: 'Deep green emerald nestled in handcrafted 22K yellow gold filigree with delicate micro-pave diamond halo accents.',
        price: 34500.00,
        category: 'Necklaces',
        stock: 15,
        imageUrl: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=800',
        ratings: 4.8,
        numReviews: 29
      },
      {
        name: 'Sparkling Crystal Drop Earrings',
        description: 'Cascading artisan chandelier earrings adorned with flawless cubic zirconia drops that catch light from every angle.',
        price: 18900.00,
        category: 'Earrings',
        stock: 25,
        imageUrl: 'https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&cs=tinysrgb&w=800',
        ratings: 4.7,
        numReviews: 44
      },
      {
        name: '18K Rose Gold Tennis Bracelet',
        description: 'Continuous strand of brilliant lab-grown diamonds set in warm 18K rose gold with secure safety clasp closure.',
        price: 58000.00,
        category: 'Bracelets',
        stock: 8,
        imageUrl: 'https://images.pexels.com/photos/1395306/pexels-photo-1395306.jpeg?auto=compress&cs=tinysrgb&w=800',
        ratings: 5.0,
        numReviews: 52
      },
      {
        name: 'Lustrous Freshwater Pearl Necklace',
        description: 'Hand-knotted triple-A grade freshwater cultured pearls with vintage-inspired sterling silver floral clasp.',
        price: 24999.00,
        category: 'Necklaces',
        stock: 18,
        imageUrl: 'https://images.pexels.com/photos/248077/pexels-photo-248077.jpeg?auto=compress&cs=tinysrgb&w=800',
        ratings: 4.8,
        numReviews: 31
      },
      {
        name: 'Vintage Sapphire Halo Band',
        description: 'Cushion cut royal blue sapphire surrounded by a halo of micro-prong diamonds on platinum band.',
        price: 64500.00,
        category: 'Rings',
        stock: 10,
        imageUrl: 'https://images.pexels.com/photos/1232931/pexels-photo-1232931.jpeg?auto=compress&cs=tinysrgb&w=800',
        ratings: 4.9,
        numReviews: 27
      }
    ];

    let addedCount = 0;
    for (const product of products) {
      const result = await Product.updateOne(
        { name: product.name },
        { $set: product },
        { upsert: true }
      );
      if (result.upsertedCount > 0 || result.modifiedCount > 0) {
        addedCount++;
      }
    }

    console.log(`Seed complete: updated/added ${addedCount} luxury jewelry products.`);
  } catch (error) {
    console.error(`Seed failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

importData();
