// Product names, categories and prices come from the Figma frames.
// Rating values and review counts are dummy prototype data, not verified reviews.

export const CATEGORIES = ['All', 'Fashion', 'Grocery', 'Electronics'];

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
    image: CARDIGAN_COLORS[0].image,
    detailResizeMode: 'contain',
    description:
      'Indulge in the timelessness of 100% Cashmere Cardigan, crafted from luxuriously light, warm, and fluffy yarn.',
    rating: { value: 4.0, count: '1.67K' },
    colors: CARDIGAN_COLORS,
    sizes: ['S', 'M', 'L'],
  },
  {
    id: 'souffle-yarn-triangle-scarf',
    name: 'Souffle Yarn Triangle Scarf',
    category: 'Fashion',
    price: '$16.99',
    image: require('../../assets/images/souffle-yarn-triangle-scarf/main.webp'),
    detailResizeMode: 'contain',
    rating: { value: 4.6, count: '248' },
  },
  {
    id: 'puck-cream-cheese',
    name: 'Puck Cream Cheese',
    category: 'Grocery',
    price: '$1.99',
    image: require('../../assets/images/puck-cream-cheese/main.webp'),
    detailResizeMode: 'contain',
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
    image: require('../../assets/images/heinz-pasta/main.webp'),
    detailResizeMode: 'contain',
    rating: { value: 4.5, count: '3.2K' },
  },
  {
    id: 'jbl-tune-720bt',
    name: 'JBL Tune 720BT',
    category: 'Electronics',
    price: '$59.99',
    image: require('../../assets/images/jbl-tune-720bt/main.webp'),
    detailResizeMode: 'contain',
    rating: { value: 4.8, count: '4.8K' },
  },
  {
    id: 'apple-tv-4th-gen',
    name: 'Apple TV 4th Gen',
    category: 'Electronics',
    price: '$299.99',
    image: require('../../assets/images/apple-tv-4th-gen/main.webp'),
    detailResizeMode: 'contain',
    rating: { value: 4.7, count: '6.1K' },
  },
  {
    id: 'apple-pencil-pro',
    name: 'Apple Pencil Pro',
    category: 'Electronics',
    price: '$129.99',
    image: require('../../assets/images/apple-pencil-pro/main.webp'),
    detailResizeMode: 'contain',
    rating: { value: 4.9, count: '2.4K' },
  },
  {
    id: 'apple-smart-keyboard',
    name: 'Apple Smart Keyboard',
    category: 'Electronics',
    price: '$269.99',
    originalPrice: '$299.99',
    image: require('../../assets/images/apple-smart-keyboard/main.webp'),
    detailResizeMode: 'contain',
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
