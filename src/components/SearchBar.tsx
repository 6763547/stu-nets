
import { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchProducts } from '@/utils/api';
import { Product } from '@/utils/types';

interface SearchBarProps {
  onAddProduct: (product: Omit<Product, 'quantity' | 'checked'>) => void;
}

const SearchBar = ({ onAddProduct }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Omit<Product, 'quantity' | 'checked'>[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Search only when user types something
    if (query.length >= 2) {
      const foundProducts = searchProducts(query);
      setResults(foundProducts);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddProduct = (product: Omit<Product, 'quantity' | 'checked'>) => {
    onAddProduct(product);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="flex w-full items-center space-x-2">
        <Input
          type="text"
          placeholder="Найти продукт..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input-animated"
          onFocus={() => query.length >= 2 && setIsOpen(true)}
        />
      </div>
      
      {isOpen && results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 animate-fade-in">
          <ul className="py-1 max-h-60 overflow-auto">
            {results.map((product) => (
              <li
                key={product.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                onClick={() => handleAddProduct(product)}
              >
                <span>{product.name}</span>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">+</Button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {isOpen && query.length >= 2 && results.length === 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 p-4 text-center text-gray-500 animate-fade-in">
          Ничего не найдено
        </div>
      )}
    </div>
  );
};

export default SearchBar;
