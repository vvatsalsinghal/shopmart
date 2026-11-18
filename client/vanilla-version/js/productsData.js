// =============================================================================
// FILE: client/js/productsData.js
// PURPOSE: In-memory Product Catalogue Database for Layer 2.
// In Layer 8 & 9, this data will move permanently to MongoDB and be fetched via Express.
// =============================================================================

// JAVASCRIPT CONCEPT: ES Module Export
// "export const" makes this data available to other JavaScript files via "import".
// This promotes modular architecture and separation of concerns.

// JAVASCRIPT CONCEPT: Array of Objects
// An Array [ ] holding multiple Objects { }. This is the universal data format
// used by REST APIs, JSON responses, React state, and MongoDB documents.
export const initialProducts = [
  {
    // JAVASCRIPT CONCEPT: Primitive Types (String, Number, Boolean)
    id: "prod-001",
    sku: "IND-DP-9021",
    title: "Variable-Speed Industrial Drill Press 1.5HP",
    category: "machinery",
    categoryLabel: "Industrial Machinery",
    description: "Commercial grade 16-speed floor drill press equipped with laser alignment and cast iron table for high precision manufacturing.",
    price: 1250.00,
    unit: "unit",
    inStock: true, // Boolean flag determining inventory availability
    leadTimeDays: 2, // Ready in 2 days from warehouse
    specs: ["1.5 HP Motor", "120V / 240V", "Floor Mount"],
    icon: "⚙️"
  },
  {
    id: "prod-002",
    sku: "PPE-GLV-4412",
    title: "Kevlar Level-5 Cut Resistant Work Gloves (Case of 100)",
    category: "safety",
    categoryLabel: "Safety & PPE",
    description: "High-dexterity polyurethane coated work gloves designed for sheet metal and glass handling. Sold in wholesale case packs.",
    price: 320.00,
    unit: "case",
    // BUSINESS RULE: Out-of-stock / Procurement required
    // Can still be added to quotation requests!
    inStock: false,
    leadTimeDays: 14, // Factory procurement lead time
    specs: ["ANSI Cut A5", "Case of 100", "Sizes S-XXL"],
    icon: "🧤"
  },
  {
    id: "prod-003",
    sku: "TLS-CAL-1088",
    title: "Digital Stainless Steel Calipers 0-150mm",
    category: "tools",
    categoryLabel: "Precision Tools",
    description: "IP54 water/dust resistant digital caliper with inch/metric conversion and high accuracy LCD screen for quality control.",
    price: 68.50,
    unit: "unit",
    inStock: true,
    leadTimeDays: 1,
    specs: ["0.01mm Accuracy", "IP54 Certified", "Hard Case"],
    icon: "📏"
  },
  {
    id: "prod-004",
    sku: "WHS-WRK-5520",
    title: "Modular Heavy-Duty Packing Workstation 72\"",
    category: "office",
    categoryLabel: "Office & Warehouse",
    description: "Steel-frame packing station with adjustable shelves, power strip mount, and roll dispenser for fulfillment centers.",
    price: 890.00,
    unit: "station",
    inStock: false,
    leadTimeDays: 21,
    specs: ["1000 lbs Capacity", "72\" x 36\" Table", "Modular Racks"],
    icon: "🪑"
  },
  {
    id: "prod-005",
    sku: "PPE-RES-3301",
    title: "Half-Face Commercial Respirator Kit (Multi-Gas)",
    category: "safety",
    categoryLabel: "Safety & PPE",
    description: "Reusable half-face respirator with replaceable organic vapor/acid gas cartridges for chemical mixing and painting facilities.",
    price: 85.00,
    unit: "kit",
    inStock: true,
    leadTimeDays: 3,
    specs: ["NIOSH Approved", "Dual Cartridge", "Silicone Seal"],
    icon: "😷"
  },
  {
    id: "prod-006",
    sku: "IND-CNC-7740",
    title: "3-Axis Desktop CNC Milling Machine",
    category: "machinery",
    categoryLabel: "Industrial Machinery",
    description: "Compact high-precision aluminum CNC mill for rapid prototyping, mold making, and circuit board etching.",
    price: 2450.00,
    unit: "unit",
    inStock: false,
    leadTimeDays: 30,
    specs: ["300x180x45mm Bed", "500W Spindle", "USB Controller"],
    icon: "🖥️"
  }
];
