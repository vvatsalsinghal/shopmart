// =============================================================================
// FILE: server/src/models/Quotation.js
// PURPOSE: Mongoose Schema & Model for Customer Quotation Requests.
// MONGOOSE CONCEPTS:
//   - Embedded Sub-documents: items array contains structured item records.
//   - Schema Enums: Restricting status to predefined business workflow states.
// =============================================================================

import mongoose from 'mongoose';

// Sub-document Schema for an item requested inside a quotation
const quotationItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: [true, 'Product ID is required']
    },
    title: {
      type: String,
      required: [true, 'Product title is required']
    },
    sku: {
      type: String,
      required: [true, 'SKU is required']
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1']
    },
    quotedUnitPrice: {
      type: Number,
      required: [true, 'Quoted unit price is required'],
      min: [0, 'Price cannot be negative']
    },
    lineItemTotal: {
      type: Number,
      required: [true, 'Line item total is required']
    },
    estimatedArrivalDate: {
      type: String,
      required: [true, 'Estimated arrival date is required']
    },
    procurementRoute: {
      type: String,
      required: [true, 'Procurement route is required']
    },
    customerNote: {
      type: String,
      default: ''
    }
  },
  { _id: false } // Avoids generating separate _id for each embedded item
);

// Main Quotation Schema
const quotationSchema = new mongoose.Schema(
  {
    quotationId: {
      type: String,
      required: [true, 'Quotation ID is required'],
      unique: true,
      trim: true
    },
    // B2B Workflow Status: Tracks quotation lifecycle through Admin review
    status: {
      type: String,
      enum: {
        values: ['PENDING_APPROVAL', 'REVIEWED', 'APPROVED', 'REJECTED'],
        message: '{VALUE} is not a valid quotation status'
      },
      default: 'PENDING_APPROVAL'
    },
    customer: {
      companyName: {
        type: String,
        required: [true, 'Customer company name is required'],
        trim: true
      },
      email: {
        type: String,
        required: [true, 'Customer email is required'],
        lowercase: true,
        trim: true
      },
      phone: {
        type: String,
        default: 'Not provided'
      },
      desiredDeliveryDate: {
        type: String,
        default: 'Flexible'
      }
    },
    // Array of embedded quotation item sub-documents
    items: {
      type: [quotationItemSchema],
      validate: {
        validator: function (items) {
          return Array.isArray(items) && items.length > 0;
        },
        message: 'A quotation must contain at least one item'
      }
    },
    totalQuotationValue: {
      type: Number,
      required: [true, 'Total quotation value is required'],
      min: [0, 'Total quotation value cannot be negative']
    },
    specialInstructions: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// MONGOOSE CONCEPT: Compiling the Schema into a Model
const Quotation = mongoose.model('Quotation', quotationSchema);

export default Quotation;
