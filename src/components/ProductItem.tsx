
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Product } from '@/utils/types';
import { cn } from '@/lib/utils';

interface ProductItemProps {
  product: Product;
  onUpdate: (id: string, updates: Partial<Product>) => void;
  onRemove: (id: string) => void;
}

const ProductItem = ({ product, onUpdate, onRemove }: ProductItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [quantity, setQuantity] = useState(product.quantity.toString());

  const handleQuantityChange = (value: string) => {
    setQuantity(value);
  };

  const handleQuantityBlur = () => {
    const parsed = parseFloat(quantity);
    
    if (!isNaN(parsed) && parsed > 0) {
      onUpdate(product.id, { quantity: parsed });
    } else {
      // Reset to previous value if invalid
      setQuantity(product.quantity.toString());
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    onUpdate(product.id, { checked });
  };

  return (
    <div className={cn(
      "product-item animate-slide-up",
      product.checked && "product-item-selected opacity-70"
    )}>
      <Checkbox 
        checked={product.checked} 
        onCheckedChange={handleCheckboxChange}
        className="mr-3"
      />
      
      <div className="flex-1">
        <h3 className={cn(
          "font-medium",
          product.checked && "line-through"
        )}>
          {product.name}
        </h3>
        {product.price && (
          <p className="text-sm text-muted-foreground">
            {product.price} ₽ / {product.unit}
          </p>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        {isEditing ? (
          <Input
            type="number"
            value={quantity}
            onChange={(e) => handleQuantityChange(e.target.value)}
            onBlur={handleQuantityBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleQuantityBlur()}
            className="w-20 h-8 text-center"
            autoFocus
          />
        ) : (
          <span 
            className="w-20 text-center cursor-pointer" 
            onClick={() => setIsEditing(true)}
          >
            {product.quantity} {product.unit}
          </span>
        )}
        
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-8 w-8 p-0 text-muted-foreground"
          onClick={() => onRemove(product.id)}
        >
          ✕
        </Button>
      </div>
    </div>
  );
};

export default ProductItem;
