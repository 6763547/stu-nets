
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Product } from '@/utils/types';
import ProductItem from './ProductItem';
import SearchBar from './SearchBar';
import { fetchProductPrices } from '@/utils/api';
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from 'uuid';

const LOCAL_STORAGE_KEY = 'product-list-items';

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);
  const { toast } = useToast();

  // Load products from localStorage on initial render
  useEffect(() => {
    const savedProducts = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (error) {
        console.error('Error parsing saved products:', error);
      }
    }
  }, []);

  // Save products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  // Fetch prices when products change
  useEffect(() => {
    const updatePrices = async () => {
      if (products.length === 0) return;
      
      setIsLoadingPrices(true);
      try {
        const productNames = products.map(p => p.name);
        const prices = await fetchProductPrices(productNames);
        
        setProducts(currentProducts => 
          currentProducts.map(product => ({
            ...product,
            price: prices[product.name] || product.price
          }))
        );
      } catch (error) {
        console.error('Failed to update prices:', error);
      } finally {
        setIsLoadingPrices(false);
      }
    };
    
    updatePrices();
  }, [products.length]);

  const handleAddProduct = (product: Omit<Product, 'quantity' | 'checked'>) => {
    // Check if the product already exists
    const existingProduct = products.find(p => p.name === product.name);
    
    if (existingProduct) {
      // Increment quantity if it already exists
      handleUpdateProduct(existingProduct.id, { 
        quantity: existingProduct.quantity + 1 
      });
      
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
      
      setProducts(prev => [...prev, newProduct]);
      
      toast({
        title: "Продукт добавлен",
        description: `${product.name} добавлен в список`,
      });
    }
  };

  const handleUpdateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === id ? { ...product, ...updates } : product
      )
    );
  };

  const handleRemoveProduct = (id: string) => {
    setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
    
    toast({
      title: "Продукт удален",
      description: "Продукт удален из списка",
    });
  };

  const handleClearChecked = () => {
    setProducts(prevProducts => prevProducts.filter(product => !product.checked));
    
    toast({
      title: "Список очищен",
      description: "Приобретенные продукты удалены из списка",
    });
  };

  const handleRefreshPrices = async () => {
    if (products.length === 0) return;
    
    setIsLoadingPrices(true);
    try {
      const productNames = products.map(p => p.name);
      const prices = await fetchProductPrices(productNames);
      
      setProducts(currentProducts => 
        currentProducts.map(product => ({
          ...product,
          price: prices[product.name]
        }))
      );
      
      toast({
        title: "Цены обновлены",
        description: "Актуальные цены загружены",
      });
    } catch (error) {
      console.error('Failed to refresh prices:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить цены",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPrices(false);
    }
  };

  // Group products by category
  const groupedProducts = products.reduce((groups, product) => {
    const category = product.category || 'Другое';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(product);
    return groups;
  }, {} as Record<string, Product[]>);

  const handleClearAll = () => {
    if (confirm('Вы уверены, что хотите очистить весь список?')) {
      setProducts([]);
      toast({
        title: "Список очищен",
        description: "Все продукты удалены из списка",
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <SearchBar onAddProduct={handleAddProduct} />
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Мой список покупок</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshPrices}
            disabled={isLoadingPrices || products.length === 0}
          >
            {isLoadingPrices ? 'Обновление...' : 'Обновить цены'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearChecked}
            disabled={!products.some(p => p.checked)}
          >
            Удалить купленные
          </Button>
          {products.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
            >
              Очистить всё
            </Button>
          )}
        </div>
      </div>
      
      {Object.entries(groupedProducts).length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground mb-2">Ваш список пуст</p>
          <p className="text-sm text-muted-foreground">Добавьте продукты с помощью поиска или из каталога</p>
        </div>
      ) : (
        Object.entries(groupedProducts).map(([category, categoryProducts]) => (
          <div key={category} className="mb-8">
            <h3 className="text-lg font-medium mb-3">{category}</h3>
            <div className="space-y-2">
              {categoryProducts.map(product => (
                <ProductItem
                  key={product.id}
                  product={product}
                  onUpdate={handleUpdateProduct}
                  onRemove={handleRemoveProduct}
                />
              ))}
            </div>
          </div>
        ))
      )}
      
      {products.length > 0 && (
        <div className="mt-6 p-4 border border-border rounded-lg">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Итого:</h3>
            <p className="font-medium">
              {products.reduce((total, product) => {
                if (product.price) {
                  return total + (product.price * product.quantity);
                }
                return total;
              }, 0).toFixed(2)} ₽
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
