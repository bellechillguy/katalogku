// Product names, categories and prices come from the Figma frames.
// Rating values and review counts are dummy prototype data, not verified reviews.
// Manufacturer details were checked against their product/support pages on 2026-10-30.
// Puck: https://www.puckarabia.com/en/products/cream-cheese-spread/cream-cheese-spread/
// JBL: https://www.jbl.com/TUNE720BT.html
// Apple Pencil Pro: https://www.apple.com/apple-pencil-pro/
// Apple TV 4th gen: https://support.apple.com/en-gb/101605
// Apple Smart Keyboard: https://support.apple.com/en-ie/guide/ipad/ipad4b92bd12/27/ipados/27

export const CATEGORIES = ['All', 'Fashion', 'Grocery', 'Electronics'];

// Demo-only commerce values; these are not live inventory or shipping quotes.
export const DEMO_COMMERCE = {
  shippingFee: 4.99,
  taxRate: 0.08,
  deliveryWindow: '2–4 business days',
};

const CARDIGAN_COLORS = [
  {
    name: 'Purple',
    value: '#59354c',
    image: require('../../assets/images/fluffy-cashmere-cardigan/purple.webp'),
  },
  {
    name: 'Black',
    value: '#111111',
    image: require('../../assets/images/fluffy-cashmere-cardigan/black.webp'),
  },
  {
    name: 'Beige',
    value: '#dbcabc',
    image: require('../../assets/images/fluffy-cashmere-cardigan/beige.webp'),
  },
  {
    name: 'Yellow',
    value: '#f0eec0',
    image: require('../../assets/images/fluffy-cashmere-cardigan/yellow.webp'),
  },
  {
    name: 'Navy',
    value: '#3c5c8e',
    image: require('../../assets/images/fluffy-cashmere-cardigan/navy.webp'),
  },
];

export const PRODUCTS = [
  {
    id: 'fluffy-cashmere-cardigan',
    name: 'Fluffy Cashmere Relax Cardigan',
    category: 'Fashion',
    price: '$84.99',
    demoStock: 7,
    image: CARDIGAN_COLORS[0].image,
    detailResizeMode: 'contain',
    description:
      'Listed as a cashmere cardigan. Fiber composition and care instructions are not provided in this demo.',
    rating: { value: 4.0, count: '1.67K' },
    colors: CARDIGAN_COLORS,
    sizes: ['S', 'M', 'L'],
  },
  {
    id: 'souffle-yarn-triangle-scarf',
    name: 'Souffle Yarn Triangle Scarf',
    category: 'Fashion',
    price: '$16.99',
    demoStock: 12,
    image: require('../../assets/images/souffle-yarn-triangle-scarf/main.webp'),
    detailResizeMode: 'contain',
    description: 'Triangle scarf. Fiber composition, dimensions, and care details are not provided in this demo.',
    rating: { value: 4.6, count: '248' },
  },
  {
    id: 'puck-cream-cheese',
    name: 'Puck Cream Cheese',
    category: 'Grocery',
    price: '$1.99',
    demoStock: 18,
    image: require('../../assets/images/puck-cream-cheese/main.webp'),
    detailResizeMode: 'contain',
    description: 'Puck cream cheese spread.',
    details: [
      { label: 'Net weight', value: '500 g' },
      { label: 'Allergen', value: 'Contains milk' },
      { label: 'Storage', value: 'After opening, refrigerate at 5°C or lower' },
    ],
    rating: { value: 4.7, count: '912' },
    crops: {
      grid: { height: '122.11%', left: 0, top: '-16.27%' },
      favorites: { height: '122.11%', left: 0, top: '-16.27%' },
    },
  },
  {
    id: 'heinz-pasta',
    name: 'Heinz Pasta',
    category: 'Grocery',
    price: '$0.99',
    demoStock: 24,
    image: require('../../assets/images/heinz-pasta/main.webp'),
    detailResizeMode: 'contain',
    description: 'Pasta with tomato and chili flavor, as shown on the product packaging.',
    details: [
      { label: 'Ingredients and net weight', value: 'Not provided in this demo listing' },
    ],
    rating: { value: 4.5, count: '3.2K' },
  },
  {
    id: 'jbl-tune-720bt',
    name: 'JBL Tune 720BT',
    category: 'Electronics',
    price: '$59.99',
    demoStock: 5,
    image: require('../../assets/images/jbl-tune-720bt/main.webp'),
    detailResizeMode: 'contain',
    description: 'Wireless over-ear headphones with Bluetooth 5.3.',
    details: [
      { label: 'Battery life', value: 'Up to 76 hours of playback' },
      { label: 'Charging time', value: 'About 2 hours from empty' },
      { label: 'In the box', value: 'USB-C charging cable and detachable audio cable' },
    ],
    rating: { value: 4.8, count: '4.8K' },
  },
  {
    id: 'apple-tv-4th-gen',
    name: 'Apple TV 4th Gen',
    category: 'Electronics',
    price: '$299.99',
    demoStock: 4,
    image: require('../../assets/images/apple-tv-4th-gen/main.webp'),
    detailResizeMode: 'contain',
    description: 'Apple TV (4th generation, model A1625) with video output up to 1080p.',
    details: [
      { label: 'Storage options', value: '32 GB or 64 GB; this listing does not specify the capacity' },
      { label: 'Connection', value: 'HDMI 1.4' },
    ],
    rating: { value: 4.7, count: '6.1K' },
  },
  {
    id: 'apple-pencil-pro',
    name: 'Apple Pencil Pro',
    category: 'Electronics',
    price: '$129.99',
    demoStock: 9,
    image: require('../../assets/images/apple-pencil-pro/main.webp'),
    detailResizeMode: 'contain',
    description: 'Stylus with squeeze and barrel-roll controls for selected compatible iPad models.',
    details: [
      { label: 'Compatibility', value: 'Selected iPad models only; check your iPad model before purchase' },
      { label: 'Charging and pairing', value: 'Attaches, pairs, and charges magnetically on the iPad' },
    ],
    rating: { value: 4.9, count: '2.4K' },
  },
  {
    id: 'apple-smart-keyboard',
    name: 'Apple Smart Keyboard',
    category: 'Electronics',
    price: '$269.99',
    demoStock: 3,
    originalPrice: '$299.99',
    image: require('../../assets/images/apple-smart-keyboard/main.webp'),
    detailResizeMode: 'contain',
    description: 'Keyboard that connects to compatible iPad models through the Smart Connector.',
    details: [
      { label: 'Pairing', value: 'No Bluetooth pairing required' },
      { label: 'Compatibility', value: 'iPad (7th–9th generation), iPad Air (3rd generation), and iPad Pro 10.5-inch' },
    ],
    discount: 10,
    rating: { value: 4.6, count: '1.1K' },
  },
];

export const getProduct = (id) => PRODUCTS.find((p) => p.id === id);

export const CATEGORY_ICON = {
  Fashion: 'shirt',
  Grocery: 'basket-outline',
  Electronics: 'hardware-chip-outline',
};
