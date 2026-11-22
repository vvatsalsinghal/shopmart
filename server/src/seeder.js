// =============================================================================
// FILE: server/src/seeder.js
// PURPOSE: Database Seeder Script for ShopMart B2B Product Catalogue.
// MONGOOSE CONCEPTS:
//   - Product.deleteMany(): Clears existing records to prevent duplicates.
//   - Product.insertMany(): Bulk-inserts an array of documents efficiently.
//   - process.exit(0): Graceful CLI exit upon successful completion.
// =============================================================================

import 'dotenv/config';
import connectDB from './config/db.js';
import Product from './models/Product.js';
import Quotation from './models/Quotation.js';
import { products } from './data/products.js';

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding process...');

    // 1. Establish live connection to MongoDB Atlas
    const conn = await connectDB();
    if (!conn) {
      throw new Error('Database connection failed. Seeding aborted.');
    }

    // 2. Clear existing collections to start with a clean state
    console.log('🧹 Clearing existing Products and Quotations...');
    await Product.deleteMany({});
    await Quotation.deleteMany({});
    console.log('✅ Old collections wiped successfully.');

    // 3. Insert our 6 master products from products.js
    console.log(`📦 Inserting ${products.length} catalogue products into MongoDB...`);
    const createdProducts = await Product.insertMany(products);

    console.log('================================================================');
    console.log('🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log(`🍃 Connected Cluster: ${conn.connection.host}`);
    console.log(`📁 Database Name:    ${conn.connection.name}`);
    console.log(`📊 Products Seeded:  ${createdProducts.length}`);
    createdProducts.forEach((p, idx) => {
      console.log(`   ${idx + 1}. [${p.sku}] ${p.title} (${p.inStock ? 'In Stock' : 'Out of Stock - 14d Lead Time'})`);
    });
    console.log('================================================================');

    process.exit(0);
  } catch (error) {
    console.error('❌ SEEDING FAILED WITH ERROR:');
    console.error(error.message);
    process.exit(1);
  }
};

seedDatabase();
