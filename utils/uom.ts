// ***********
// * IMPORTS * 
// ***********

import { UomOption } from "@/types/types";



// ***********
// * EXPORTS * 
// ***********

export const uomOptions: UomOption[] = [
  // ─── MASS ─────────────────────────
  { id: 1, label: 'Gram', abbr: 'g', metric: true, type: 'mass' },
  { id: 2, label: 'Kilogram', abbr: 'kg', metric: true, type: 'mass' },
  { id: 3, label: 'Milligram', abbr: 'mg', metric: true, type: 'mass' },
  { id: 4, label: 'Microgram', abbr: 'mcg', metric: true, type: 'mass' },
  { id: 5, label: 'Ounce', abbr: 'oz', metric: false, type: 'mass' },
  { id: 6, label: 'Pound', abbr: 'lb', metric: false, type: 'mass' },
  { id: 7, label: 'Stone', abbr: 'st', metric: false, type: 'mass' },

  // ─── VOLUME ───────────────────────
  { id: 8, label: 'Milliliter', abbr: 'mL', metric: true, type: 'volume' },
  { id: 9, label: 'Liter', abbr: 'L', metric: true, type: 'volume' },
  { id: 10, label: 'Teaspoon', abbr: 'tsp', metric: false, type: 'volume' },
  { id: 11, label: 'Tablespoon', abbr: 'tbsp', metric: false, type: 'volume' },
  { id: 12, label: 'Fluid Ounce', abbr: 'fl oz', metric: false, type: 'volume' },
  { id: 13, label: 'Cup', abbr: 'cup', metric: false, type: 'volume' },
  { id: 14, label: 'US Pint', abbr: 'pt', metric: false, type: 'volume' },
  { id: 15, label: 'US Quart', abbr: 'qt', metric: false, type: 'volume' },
  { id: 16, label: 'US Gallon', abbr: 'gal', metric: false, type: 'volume' },
  { id: 17, label: 'Imperial Pint', abbr: 'imp pt', metric: false, type: 'volume' },
  { id: 18, label: 'Imperial Quart', abbr: 'imp qt', metric: false, type: 'volume' },
  { id: 19, label: 'Imperial Gallon', abbr: 'imp gal', metric: false, type: 'volume' },
  { id: 20, label: 'Drop', abbr: 'drop', metric: false, type: 'volume' },
  { id: 21, label: 'Dash', abbr: 'dash', metric: false, type: 'volume' },
  { id: 22, label: 'Pinch', abbr: 'pinch', metric: false, type: 'volume' },

  // ─── COUNT ────────────────────────
  { id: 23, label: 'Each', abbr: 'ea', metric: false, type: 'count' },
  { id: 24, label: 'Clove', abbr: 'clove', metric: false, type: 'count' },
  { id: 25, label: 'Slice', abbr: 'slice', metric: false, type: 'count' },
  { id: 26, label: 'Piece', abbr: 'pc', metric: false, type: 'count' },
  { id: 27, label: 'Can', abbr: 'can', metric: false, type: 'count' },
  { id: 28, label: 'Package', abbr: 'pkg', metric: false, type: 'count' },
  { id: 29, label: 'Bottle', abbr: 'bottle', metric: false, type: 'count' },
  { id: 30, label: 'Bag', abbr: 'bag', metric: false, type: 'count' },
  { id: 31, label: 'Roll', abbr: 'roll', metric: false, type: 'count' },
  { id: 32, label: 'Jar', abbr: 'jar', metric: false, type: 'count' },
  { id: 33, label: 'Box', abbr: 'box', metric: false, type: 'count' },
  { id: 34, label: 'Heart', abbr: 'heart', metric: false, type: 'count' },
  { id: 35, label: 'Stick', abbr: 'stick', metric: false, type: 'count' },
  { id: 36, label: 'Sprig', abbr: 'sprig', metric: false, type: 'count' },
  { id: 37, label: 'Leaf', abbr: 'leaf', metric: false, type: 'count' },

  // ─── LENGTH ───────────────────────
  { id: 38, label: 'Inch', abbr: 'in', metric: false, type: 'length' },
  { id: 39, label: 'Centimeter', abbr: 'cm', metric: true, type: 'length' },
  { id: 40, label: 'Millimeter', abbr: 'mm', metric: true, type: 'length' },
  { id: 41, label: 'Foot', abbr: 'ft', metric: false, type: 'length' },
  { id: 42, label: 'Yard', abbr: 'yd', metric: false, type: 'length' },

  // ─── OTHER ────────────────────────
  { id: 43, label: 'To taste', abbr: 'to taste', metric: false, type: 'other' },
  { id: 44, label: 'As needed', abbr: 'as needed', metric: false, type: 'other' },
  { id: 45, label: 'Servings', abbr: 'servings', metric: false, type: 'other' },
  { id: 46, label: 'Bunch', abbr: 'bunch', metric: false, type: 'other' },
];

