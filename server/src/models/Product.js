// =============================================================================
// FILE: server/src/models/Product.js
// PURPOSE: Mongoose Schema & Model for B2B Products in Catalogue.
// MONGOOSE CONCEPTS:
//   - Schema: The structural blueprint and validation rules for documents.
//   - Model: The compiled constructor that provides database query methods (find, create, etc.).
// =============================================================================

import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    // Business ID (e.g., 'prod-001') for friendly human and API references
    id: {
      type: String,
      required: [true, 'Product ID is required'],
      unique: true,
      trim: true
    },
    // Stock Keeping Unit (e.g., 'IND-DP-9021')
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      uppercase: true,
      trim: true
    },
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category slug is required'],
      lowercase: true,
      trim: true
    },
    categoryLabel: {
      type: String,
      required: [true, 'Category label is required']
    },
    description: {
      type: String,
      required: [true, 'Product description is required']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    unit: {
      type: String,
      default: 'unit'
    },
    // In B2B Quotations: items with inStock = false trigger procurement lead-time ETAs!
    inStock: {
      type: Boolean,
      default: true
    },
    leadTimeDays: {
      type: Number,
      default: 2,
      min: [1, 'Lead time must be at least 1 day']
    },
    specs: {
      type: [String],
      default: []
    },
    icon: {
      type: String,
      default: '📦'
    }
  },
  {
    // MONGOOSE CONCEPT: timestamps: true
    // Automatically generates createdAt and updatedAt fields for auditing!
    timestamps: true
  }
);

// MONGOOSE CONCEPT: Compiling the Schema into a Model
// mongoose.model('Product', productSchema) binds to the 'products' collection in MongoDB!
const Product = mongoose.model('Product', productSchema);

export default Product;
