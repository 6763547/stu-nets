
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Product } from '@/utils/types';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/components/ui/use-toast";
import { mockCatalog } from '@/utils/api';

interface AddProductFormProps {
  onAddProduct: (product: Product) => void;
}

const AddProductForm = ({ onAddProduct }: AddProductFormProps) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(mockCatalog[0]?.name || '');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('шт');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Ошибка",
        description: "Укажите название продукта",
        variant: "destructive",
      });
      return;
    }
    
    const parsedQuantity = parseFloat(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      toast({
        title: "Ошибка",
        description: "Укажите корректное количество",
        variant: "destructive",
      });
      return;
    }
    
    const newProduct: Product = {
      id: uuidv4(),
      name: name.trim(),
      category,
      quantity: parsedQuantity,
      unit,
      checked: false,
    };
    
    onAddProduct(newProduct);
    toast({
      title: "Продукт добавлен",
      description: `${name} добавлен в список`,
    });
    
    // Reset form
    setName('');
    setQuantity('1');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded-lg animate-fade-in">
      <h3 className="font-medium">Добавить новый продукт</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Название
          </label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-animated"
            placeholder="Название продукта"
          />
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Категория
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary input-animated"
          >
            {mockCatalog.map(cat => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
            Количество
          </label>
          <Input
            id="quantity"
            type="number"
            min="0.1"
            step="0.1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="input-animated"
          />
        </div>
        
        <div>
          <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
            Единица измерения
          </label>
          <select
            id="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary input-animated"
          >
            <option value="шт">шт</option>
            <option value="кг">кг</option>
            <option value="л">л</option>
            <option value="г">г</option>
            <option value="мл">мл</option>
            <option value="уп">уп</option>
          </select>
        </div>
      </div>
      
      <Button type="submit" className="w-full md:w-auto">
        Добавить в список
      </Button>
    </form>
  );
};

export default AddProductForm;
