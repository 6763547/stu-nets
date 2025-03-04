
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Product, ProductCategory } from '@/utils/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from 'uuid';
import { mockCatalog } from '@/utils/api';

interface ProductCatalogProps {
  onAddProduct: (product: Omit<Product, 'quantity' | 'checked'>) => void;
}

const ProductCatalog = ({ onAddProduct }: ProductCatalogProps) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(mockCatalog[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const handleAddProduct = (product: Omit<Product, 'quantity' | 'checked'>) => {
    onAddProduct(product);
    toast({
      title: "Продукт добавлен",
      description: `${product.name} добавлен в список`,
    });
  };

  // Filter categories and products based on search
  const filteredCatalog = searchQuery.trim() 
    ? mockCatalog.map(category => ({
        ...category,
        products: category.products.filter(product => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.products.length > 0)
    : mockCatalog;

  const activeProducts = activeCategory 
    ? filteredCatalog.find(c => c.id === activeCategory)?.products || []
    : [];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Найти в каталоге..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-animated max-w-md"
        />
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Category sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <h2 className="text-lg font-medium mb-3">Категории</h2>
          <div className="space-y-1 bg-muted/30 rounded-lg p-2">
            {filteredCatalog.map(category => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name} 
                <span className="ml-auto text-xs bg-muted px-2 py-1 rounded-full">
                  {category.products.length}
                </span>
              </Button>
            ))}
          </div>
        </div>
        
        {/* Products grid */}
        <div className="flex-grow">
          <h2 className="text-lg font-medium mb-3">
            {activeCategory ? filteredCatalog.find(c => c.id === activeCategory)?.name : 'Продукты'}
          </h2>
          
          {activeProducts.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">Нет продуктов в этой категории</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeProducts.map(product => (
                <div
                  key={product.id}
                  className="p-4 border border-border rounded-lg hover:shadow-sm transition-all duration-200 flex flex-col"
                >
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">Ед. изм: {product.unit}</p>
                  <Button
                    className="mt-auto"
                    size="sm"
                    onClick={() => handleAddProduct(product)}
                  >
                    Добавить в список
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;
