// ***********
// * IMPORTS * 
// ***********

import { UomOption, UomOptionType } from "@/types/types";



// ***********
// * EXPORTS * 
// ***********

export const uomOptions: UomOption[] = [
  // ─── MASS ─────────────────────────
  { id: 1, label: 'Gram', abbr: 'g', metric: true, type: 'weight' },
  { id: 2, label: 'Kilogram', abbr: 'kg', metric: true, type: 'weight' },
  { id: 3, label: 'Milligram', abbr: 'mg', metric: true, type: 'weight' },
  { id: 4, label: 'Ounce', abbr: 'oz', metric: false, type: 'weight' },
  { id: 5, label: 'Pound', abbr: 'lb', metric: false, type: 'weight' },

  // ─── VOLUME ───────────────────────
  { id: 6, label: 'Milliliter', abbr: 'mL', metric: true, type: 'volume' },
  { id: 7, label: 'Liter', abbr: 'L', metric: true, type: 'volume' },
  { id: 8, label: 'Teaspoon', abbr: 'tsp', metric: false, type: 'volume' },
  { id: 9, label: 'Tablespoon', abbr: 'tbsp', metric: false, type: 'volume' },
  { id: 10, label: 'Fluid Ounce', abbr: 'fl oz', metric: false, type: 'volume' },
  { id: 11, label: 'Cup', abbr: 'cup', metric: false, type: 'volume' },
  { id: 12, label: 'US Pint', abbr: 'pt', metric: false, type: 'volume' },
  { id: 13, label: 'US Quart', abbr: 'qt', metric: false, type: 'volume' },
  { id: 14, label: 'US Gallon', abbr: 'gal', metric: false, type: 'volume' },
  { id: 15, label: 'Imperial Pint', abbr: 'imp pt', metric: false, type: 'volume' },
  { id: 16, label: 'Imperial Quart', abbr: 'imp qt', metric: false, type: 'volume' },
  { id: 17, label: 'Imperial Gallon', abbr: 'imp gal', metric: false, type: 'volume' },
  { id: 18, label: 'Drop', abbr: 'drop', metric: false, type: 'volume' },
  { id: 19, label: 'Dash', abbr: 'dash', metric: false, type: 'volume' },
  { id: 20, label: 'Pinch', abbr: 'pinch', metric: false, type: 'volume' },

  // ─── COUNT ────────────────────────
  { id: 21, label: 'Each', abbr: 'ea', metric: false, type: 'count' },
  { id: 22, label: 'Clove', abbr: 'clove', metric: false, type: 'count' },
  { id: 23, label: 'Slice', abbr: 'slice', metric: false, type: 'count' },
  { id: 24, label: 'Piece', abbr: 'pc', metric: false, type: 'count' },
  { id: 25, label: 'Can', abbr: 'can', metric: false, type: 'count' },
  { id: 26, label: 'Package', abbr: 'pkg', metric: false, type: 'count' },
  { id: 27, label: 'Bottle', abbr: 'bottle', metric: false, type: 'count' },
  { id: 28, label: 'Bag', abbr: 'bag', metric: false, type: 'count' },
  { id: 29, label: 'Roll', abbr: 'roll', metric: false, type: 'count' },
  { id: 30, label: 'Jar', abbr: 'jar', metric: false, type: 'count' },
  { id: 31, label: 'Box', abbr: 'box', metric: false, type: 'count' },
  { id: 32, label: 'Heart', abbr: 'heart', metric: false, type: 'count' },
  { id: 33, label: 'Stick', abbr: 'stick', metric: false, type: 'count' },
  { id: 34, label: 'Sprig', abbr: 'sprig', metric: false, type: 'count' },
  { id: 35, label: 'Leaf', abbr: 'leaf', metric: false, type: 'count' },

  // ─── LENGTH ───────────────────────
  { id: 36, label: 'Inch', abbr: 'in', metric: false, type: 'length' },
  { id: 37, label: 'Centimeter', abbr: 'cm', metric: true, type: 'length' },
  { id: 38, label: 'Millimeter', abbr: 'mm', metric: true, type: 'length' },
  { id: 39, label: 'Foot', abbr: 'ft', metric: false, type: 'length' },
  { id: 40, label: 'Yard', abbr: 'yd', metric: false, type: 'length' },

  // ─── OTHER ────────────────────────
  { id: 41, label: 'To taste', abbr: 'to taste', metric: false, type: 'other' },
  { id: 42, label: 'As needed', abbr: 'as needed', metric: false, type: 'other' },
  { id: 43, label: 'Servings', abbr: 'servings', metric: false, type: 'other' },
  { id: 44, label: 'Bunch', abbr: 'bunch', metric: false, type: 'other' },
];


// ------------- UNITS ------------- //

export const unitTypes: UomOptionType[] = [
    { id: 1, label: 'weight' },
    { id: 2, label: 'volume' },
    { id: 3, label: 'count' },
    { id: 4, label: 'length' },
    { id: 5, label: 'other' }
]

