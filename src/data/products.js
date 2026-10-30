// Product names, categories and prices come from the Figma frames.
// Detailed product data is only included where it is present in the design source.

export const CATEGORIES = ['All', 'Fashion', 'Grocery', 'Electronics'];

const CLOTHING_COLORS = [
  { name: 'Plum', value: '#59354c' },
  { name: 'Black', value: '#111111' },
  { name: 'Beige', value: '#dbcabc' },
  { name: 'Cream', value: '#f0eec0' },
  { name: 'Blue', value: '#3c5c8e' },
];

export const PRODUCTS = [
  {
    id: 'fluffy-cashmere-cardigan',
    name: 'Fluffy Cashmere Cardigan',
    category: 'Fashion',
    price: '$84.99',
    image: require('../../assets/images/cardigan.webp'),
    detailImage: require('../../assets/images/cardigan-detail.webp'),
    detailResizeMode: 'contain',
    description:
      'Indulge in the timelessness of 100% Cashmere Cardigan, crafted from luxuriously light, warm, and fluffy yarn.',
    rating: { value: 4, count: '1.67K' },
    colors: CLOTHING_COLORS,
    sizes: ['S', 'M', 'L'],
  },
  {
    id: 'souffle-yarn-triangle-scarf',
    name: 'Souffle Yarn Triangle Scarf',
    category: 'Fashion',
    price: '$16.99',
    image: require('../../assets/images/scarf.webp'),
    detailResizeMode: 'contain',
  },
  {
    id: 'puck-cream-cheese',
    name: 'Puck Cream Cheese',
    category: 'Grocery',
    price: '$1.99',
    image: require('../../assets/images/puck-cream-cheese.webp'),
    detailResizeMode: 'contain',
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
    image: require('../../assets/images/heinz-pasta.webp'),
    detailResizeMode: 'contain',
  },
  {
    id: 'jbl-tune-720bt',
    name: 'JBL Tune 720BT',
    category: 'Electronics',
    price: '$59.99',
    image: require('../../assets/images/jbl-tune-720bt.webp'),
    detailResizeMode: 'contain',
  },
  {
    id: 'apple-tv-4th-gen',
    name: 'Apple TV 4th Gen',
    category: 'Electronics',
    price: '$299.99',
    image: require('../../assets/images/apple-tv.webp'),
    detailResizeMode: 'contain',
  },
  {
    id: 'apple-pencil-pro',
    name: 'Apple Pencil Pro',
    category: 'Electronics',
    price: '$129.99',
    image: require('../../assets/images/apple-pencil-pro.webp'),
    detailResizeMode: 'contain',
  },
  {
    id: 'apple-smart-keyboard',
    name: 'Apple Smart Keyboard',
    category: 'Electronics',
    price: '$269.99',
    originalPrice: '$299.99',
    image: require('../../assets/images/apple-smart-keyboard.webp'),
    detailResizeMode: 'contain',
    discount: 10,
  },
];

export const getProduct = (id) => PRODUCTS.find((p) => p.id === id);

export const CATEGORY_ICON = {
  Fashion: 'shirt',
  Grocery: 'basket-outline',
  Electronics: 'hardware-chip-outline',
};
