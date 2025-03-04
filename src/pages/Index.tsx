
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ProductList from '@/components/ProductList';
import AddProductForm from '@/components/AddProductForm';
import { Product } from '@/utils/types';
import { v4 as uuidv4 } from 'uuid';

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
    setShowAddForm(false);
  };

  const handleAddFromCatalog = (product: Omit<Product, 'quantity' | 'checked'>) => {
    // Check if product already exists
    const existingProduct = products.find(p => p.name === product.name);
    
    if (existingProduct) {
      // Update quantity if it exists
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === existingProduct.id 
            ? { ...p, quantity: p.quantity + 1 } 
            : p
        )
      );
    } else {
      // Add as new product
      const newProduct: Product = {
        ...product,
        id: uuidv4(),
        quantity: 1,
        checked: false,
      };
      setProducts(prev => [...prev, newProduct]);
    }
  };

  return (
    <div className="min-h-screen pb-16">
      <Header />
      
      <main className="container pt-24 pb-16 animate-fade-in">
        <ProductList />
        
        <div className="mt-10 flex justify-center">
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            {showAddForm ? 'Скрыть форму' : 'Добавить новый продукт'}
          </button>
        </div>
        
        {showAddForm && (
          <div className="mt-4">
            <AddProductForm onAddProduct={handleAddProduct} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
