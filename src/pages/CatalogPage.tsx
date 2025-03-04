
import { useState } from 'react';
import Header from '@/components/Header';
import ProductCatalog from '@/components/ProductCatalog';
import { Product } from '@/utils/types';
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/components/ui/use-toast";
import { fetchProductPrices } from '@/utils/api';

const LOCAL_STORAGE_KEY = 'product-list-items';

const CatalogPage = () => {
  const { toast } = useToast();

  const handleAddProduct = (product: Omit<Product, 'quantity' | 'checked'>) => {
    // Get current products from localStorage
    const savedProducts = localStorage.getItem(LOCAL_STORAGE_KEY);
    let products: Product[] = [];
    
    if (savedProducts) {
      try {
        products = JSON.parse(savedProducts);
      } catch (error) {
        console.error('Error parsing saved products:', error);
      }
    }
    
    // Check if product already exists
    const existingProduct = products.find(p => p.name === product.name);
    
    if (existingProduct) {
      // Update quantity if it exists
      const updatedProducts = products.map(p => 
        p.id === existingProduct.id 
          ? { ...p, quantity: p.quantity + 1 } 
          : p
      );
      
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProducts));
      
      toast({
        title: "Количество обновлено",
        description: `${product.name} теперь ${existingProduct.quantity + 1} ${product.unit}`,
      });
    } else {
      // Add as new product
      const newProduct: Product = {
        ...product,
        id: uuidv4(),
        quantity: 1,
        checked: false,
      };
      
      const updatedProducts = [...products, newProduct];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProducts));
      
      toast({
        title: "Продукт добавлен",
        description: `${product.name} добавлен в список`,
      });
      
      // Fetch price for the new product
      fetchProductPrices([product.name]).then(prices => {
        if (prices[product.name]) {
          const productsWithPrice = updatedProducts.map(p => 
            p.id === newProduct.id 
              ? { ...p, price: prices[p.name] } 
              : p
          );
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(productsWithPrice));
        }
      });
    }
  };

  return (
    <div className="min-h-screen pb-16">
      <Header />
      
      <main className="container pt-24 pb-16 animate-fade-in">
        <ProductCatalog onAddProduct={handleAddProduct} />
      </main>
    </div>
  );
};

export default CatalogPage;
