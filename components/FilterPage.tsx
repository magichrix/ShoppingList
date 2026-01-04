import React, { useState } from 'react';
import { FilterState, CATEGORIES, COUNTRIES, Category, Country } from '../types';
import { X } from 'lucide-react';

interface Props {
  currentFilters: FilterState;
  availableBrands: string[];
  onApply: (filters: FilterState) => void;
  onCancel: () => void;
}

const FilterPage: React.FC<Props> = ({ currentFilters, availableBrands, onApply, onCancel }) => {
  const [categories, setCategories] = useState<Category[]>(currentFilters.categories);
  const [country, setCountry] = useState<Country | null>(currentFilters.country);
  const [brands, setBrands] = useState<string[]>(currentFilters.brands);

  const toggleCategory = (c: Category) => {
    setCategories(prev => prev.includes(c) ? prev.filter(i => i !== c) : [...prev, c]);
  };

  const toggleBrand = (b: string) => {
    setBrands(prev => prev.includes(b) ? prev.filter(i => i !== b) : [...prev, b]);
  };

  const handleClear = () => {
    setCategories([]);
    setCountry(null);
    setBrands([]);
  };

  return (
    <div className="flex flex-col h-full bg-white animate-in slide-in-from-bottom duration-300">
      <div className="px-4 py-4 flex items-center justify-between border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-800">篩選</h2>
        <button onClick={onCancel} className="p-2 text-gray-500 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8 no-scrollbar">
        
        {/* Categories */}
        <section>
            <h3 className="text-sm font-bold text-gray-900 mb-3">類別 (多選)</h3>
            <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(c => {
                    const active = categories.includes(c);
                    return (
                        <button
                            key={c}
                            onClick={() => toggleCategory(c)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                                active 
                                ? 'bg-tiffany text-white border-tiffany' 
                                : 'bg-white text-gray-600 border-gray-200'
                            }`}
                        >
                            {c}
                        </button>
                    )
                })}
            </div>
        </section>

        {/* Country */}
        <section>
            <h3 className="text-sm font-bold text-gray-900 mb-3">國家 (單選)</h3>
            <div className="flex flex-wrap gap-2">
                {COUNTRIES.map(c => {
                    const active = country === c;
                    return (
                        <button
                            key={c}
                            onClick={() => setCountry(active ? null : c)} // Toggle off if clicked again
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                                active 
                                ? 'bg-tiffany text-white border-tiffany' 
                                : 'bg-white text-gray-600 border-gray-200'
                            }`}
                        >
                            {c}
                        </button>
                    )
                })}
            </div>
        </section>

        {/* Brands */}
        {availableBrands.length > 0 && (
            <section>
                <h3 className="text-sm font-bold text-gray-900 mb-3">牌子 (多選)</h3>
                <div className="flex flex-wrap gap-2">
                    {availableBrands.map(b => {
                        const active = brands.includes(b);
                        return (
                            <button
                                key={b}
                                onClick={() => toggleBrand(b)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                                    active 
                                    ? 'bg-tiffany text-white border-tiffany' 
                                    : 'bg-white text-gray-600 border-gray-200'
                                }`}
                            >
                                {b}
                            </button>
                        )
                    })}
                </div>
            </section>
        )}

      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-100 flex gap-4">
        <button 
            onClick={handleClear}
            className="flex-1 py-3 text-gray-500 font-bold text-sm bg-gray-100 rounded-xl"
        >
            清除全部
        </button>
        <button 
            onClick={() => onApply({ categories, country, brands })}
            className="flex-[2] py-3 text-white font-bold text-sm bg-tiffany rounded-xl shadow-lg shadow-tiffany/30"
        >
            套用篩選
        </button>
      </div>
    </div>
  );
};

export default FilterPage;