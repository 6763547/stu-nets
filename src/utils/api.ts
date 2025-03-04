
import { Product } from './types';

// Mock catalog data
export const mockCatalog = [
  {
    id: 'cat-1',
    name: 'Фрукты и овощи',
    products: [
      { id: 'p-1', name: 'Яблоки', category: 'Фрукты и овощи', unit: 'кг' },
      { id: 'p-2', name: 'Бананы', category: 'Фрукты и овощи', unit: 'кг' },
      { id: 'p-3', name: 'Огурцы', category: 'Фрукты и овощи', unit: 'кг' },
      { id: 'p-4', name: 'Помидоры', category: 'Фрукты и овощи', unit: 'кг' },
      { id: 'p-5', name: 'Картофель', category: 'Фрукты и овощи', unit: 'кг' },
      { id: 'p-6', name: 'Морковь', category: 'Фрукты и овощи', unit: 'кг' },
      { id: 'p-7', name: 'Лук', category: 'Фрукты и овощи', unit: 'кг' },
    ]
  },
  {
    id: 'cat-2',
    name: 'Молочные продукты',
    products: [
      { id: 'p-8', name: 'Молоко', category: 'Молочные продукты', unit: 'л' },
      { id: 'p-9', name: 'Сыр', category: 'Молочные продукты', unit: 'кг' },
      { id: 'p-10', name: 'Йогурт', category: 'Молочные продукты', unit: 'шт' },
      { id: 'p-11', name: 'Творог', category: 'Молочные продукты', unit: 'кг' },
      { id: 'p-12', name: 'Сметана', category: 'Молочные продукты', unit: 'шт' },
    ]
  },
  {
    id: 'cat-3',
    name: 'Мясо и рыба',
    products: [
      { id: 'p-13', name: 'Курица', category: 'Мясо и рыба', unit: 'кг' },
      { id: 'p-14', name: 'Говядина', category: 'Мясо и рыба', unit: 'кг' },
      { id: 'p-15', name: 'Свинина', category: 'Мясо и рыба', unit: 'кг' },
      { id: 'p-16', name: 'Лосось', category: 'Мясо и рыба', unit: 'кг' },
      { id: 'p-17', name: 'Треска', category: 'Мясо и рыба', unit: 'кг' },
    ]
  },
  {
    id: 'cat-4',
    name: 'Бакалея',
    products: [
      { id: 'p-18', name: 'Рис', category: 'Бакалея', unit: 'кг' },
      { id: 'p-19', name: 'Макароны', category: 'Бакалея', unit: 'кг' },
      { id: 'p-20', name: 'Гречка', category: 'Бакалея', unit: 'кг' },
      { id: 'p-21', name: 'Мука', category: 'Бакалея', unit: 'кг' },
      { id: 'p-22', name: 'Сахар', category: 'Бакалея', unit: 'кг' },
      { id: 'p-23', name: 'Соль', category: 'Бакалея', unit: 'кг' },
    ]
  },
  {
    id: 'cat-5',
    name: 'Напитки',
    products: [
      { id: 'p-24', name: 'Вода', category: 'Напитки', unit: 'л' },
      { id: 'p-25', name: 'Сок', category: 'Напитки', unit: 'л' },
      { id: 'p-26', name: 'Чай', category: 'Напитки', unit: 'уп' },
      { id: 'p-27', name: 'Кофе', category: 'Напитки', unit: 'уп' },
    ]
  },
];

// Function to fetch product prices from bdex.ru
export const fetchProductPrices = async (productNames: string[]): Promise<Record<string, number>> => {
  try {
    // Here we would fetch data from bdex.ru, but for now we'll return mock data
    // In a production environment, this would be a fetch call to a proxy server that scrapes bdex.ru
    
    console.log('Fetching prices for:', productNames);
    
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock price data
    const mockPrices: Record<string, number> = {
      'Яблоки': 120,
      'Бананы': 90,
      'Огурцы': 150,
      'Помидоры': 180,
      'Картофель': 45,
      'Морковь': 60,
      'Лук': 40,
      'Молоко': 85,
      'Сыр': 450,
      'Йогурт': 75,
      'Творог': 230,
      'Сметана': 110,
      'Курица': 230,
      'Говядина': 450,
      'Свинина': 320,
      'Лосось': 650,
      'Треска': 380,
      'Рис': 95,
      'Макароны': 70,
      'Гречка': 85,
      'Мука': 65,
      'Сахар': 80,
      'Соль': 35,
      'Вода': 45,
      'Сок': 120,
      'Чай': 150,
      'Кофе': 350,
    };
    
    // Filter prices for requested products
    const result: Record<string, number> = {};
    productNames.forEach(name => {
      if (mockPrices[name]) {
        result[name] = mockPrices[name];
      } else {
        // Random price between 30 and 500 for products not in the mock data
        result[name] = Math.floor(Math.random() * 470) + 30;
      }
    });
    
    return result;
  } catch (error) {
    console.error('Error fetching product prices:', error);
    return {};
  }
};

// Search products by name
export const searchProducts = (query: string) => {
  const results: any[] = [];
  
  if (!query.trim()) return results;
  
  const lowercaseQuery = query.toLowerCase();
  
  mockCatalog.forEach(category => {
    category.products.forEach(product => {
      if (product.name.toLowerCase().includes(lowercaseQuery)) {
        results.push(product);
      }
    });
  });
  
  return results;
};

// Get all products as a flat array
export const getAllProducts = () => {
  const results: any[] = [];
  
  mockCatalog.forEach(category => {
    category.products.forEach(product => {
      results.push(product);
    });
  });
  
  return results;
};
