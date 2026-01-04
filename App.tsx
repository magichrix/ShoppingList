import React, { useState, useMemo, useEffect } from 'react';
import { Item, FilterState, SortOption, CATEGORIES, COUNTRIES } from './types';
import { Plus, Search, Filter, ArrowLeft, Heart, ExternalLink, MapPin, Tag, CheckCircle, Trash2, ChevronLeft, Save, Star, ShoppingBag } from 'lucide-react';
import ItemList from './components/ItemList';
import ItemDetail from './components/ItemDetail';
import ItemForm from './components/ItemForm';
import FilterPage from './components/FilterPage';
import Modal from './components/Modal';

// --- View State Types ---
type ViewState = 
  | { type: 'LIST' }
  | { type: 'DETAIL'; itemId: string }
  | { type: 'ADD' }
  | { type: 'EDIT'; itemId: string }
  | { type: 'FILTER' };

// --- Dummy Data ---
const INITIAL_ITEMS: Item[] = [
  {
    id: '1',
    name: 'EVE A錠 止痛藥',
    image: 'https://picsum.photos/400/400?random=1',
    category: '藥品',
    country: '日本',
    rating: 5,
    quantity: 2,
    brand: 'SSP',
    note: '一定要買白色盒裝，藍色太強。',
    isBought: false,
    createdAt: Date.now() - 100000,
  },
  {
    id: '2',
    name: 'Olive Young 貝果餅乾',
    image: 'https://picsum.photos/400/400?random=2',
    category: '零食',
    country: '韓國',
    rating: 4,
    quantity: 5,
    brand: 'Delight Project',
    isBought: false,
    createdAt: Date.now() - 200000,
  },
  {
    id: '3',
    name: '鳳梨酥 (佳德)',
    image: 'https://picsum.photos/400/400?random=3',
    category: '零食',
    country: '台灣',
    rating: 5,
    quantity: 1,
    brand: '佳德',
    shop: '台北總店',
    isBought: true,
    createdAt: Date.now() - 500000,
  }
];

export default function App() {
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
  const [view, setView] = useState<ViewState>({ type: 'LIST' });
  
  // List View State
  const [activeTab, setActiveTab] = useState<'UNBOUGHT' | 'BOUGHT'>('UNBOUGHT');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('LATEST');
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    country: null,
    brands: []
  });

  // Modal State
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    confirmColor?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Derived Data
  const filteredItems = useMemo(() => {
    let result = items.filter(item => {
      // 1. Tab Status
      const tabMatch = activeTab === 'UNBOUGHT' ? !item.isBought : item.isBought;
      if (!tabMatch) return false;

      // 2. Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchNote = item.note?.toLowerCase().includes(q);
        if (!matchName && !matchNote) return false;
      }

      // 3. Filter Page Criteria
      if (filters.categories.length > 0 && !filters.categories.includes(item.category)) return false;
      if (filters.country && item.country !== filters.country) return false;
      if (filters.brands.length > 0 && item.brand && !filters.brands.includes(item.brand)) return false;

      return true;
    });

    // 4. Sort
    return result.sort((a, b) => {
      switch (sortBy) {
        case 'RATING': return b.rating - a.rating;
        case 'CATEGORY': return a.category.localeCompare(b.category);
        case 'BRAND': return (a.brand || '').localeCompare(b.brand || '');
        case 'LATEST': default: return b.createdAt - a.createdAt;
      }
    });
  }, [items, activeTab, searchQuery, filters, sortBy]);

  // Actions
  const handleAddItem = (newItem: Item) => {
    setItems(prev => [newItem, ...prev]);
    setView({ type: 'LIST' });
  };

  const handleEditItem = (updatedItem: Item) => {
    setItems(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
    setView({ type: 'DETAIL', itemId: updatedItem.id });
  };

  const handleDeleteItem = (id: string) => {
    setModalConfig({
      isOpen: true,
      title: '確認刪除',
      message: '確認刪除此項目？此操作不可復原。',
      confirmText: '刪除',
      confirmColor: 'bg-red-500',
      onConfirm: () => {
        setItems(prev => prev.filter(i => i.id !== id));
        setView({ type: 'LIST' });
        setModalConfig(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    const targetStatus = !currentStatus;
    const actionName = targetStatus ? '已買' : '未買';
    
    setModalConfig({
      isOpen: true,
      title: `標記為${actionName}`,
      message: `確認將此項目標記為『${actionName}』？`,
      confirmText: '確認',
      confirmColor: 'bg-tiffany',
      onConfirm: () => {
        setItems(prev => prev.map(i => i.id === id ? { ...i, isBought: targetStatus } : i));
        // If we are in Detail view, we stay there, but the button text changes.
        // If we are in List view, the item will disappear from current tab (logic handled in swipe component).
        setModalConfig(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // --- Render Views ---

  const renderView = () => {
    switch (view.type) {
      case 'LIST':
        return (
          <div className="flex flex-col h-full bg-gray-50">
            {/* Header */}
            <div className="bg-white px-4 py-3 sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="搜尋名稱、備註..." 
                    className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tiffany/50"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => setView({ type: 'FILTER' })}
                  className={`p-2 rounded-lg ${
                    filters.categories.length || filters.country || filters.brands.length 
                    ? 'bg-tiffany/10 text-tiffany' 
                    : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex justify-between items-center">
                 <div className="flex gap-6 text-sm font-medium">
                  <button 
                    onClick={() => setActiveTab('UNBOUGHT')}
                    className={`pb-2 relative ${activeTab === 'UNBOUGHT' ? 'text-tiffany' : 'text-gray-400'}`}
                  >
                    未買清單
                    {activeTab === 'UNBOUGHT' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-tiffany rounded-full" />}
                  </button>
                  <button 
                    onClick={() => setActiveTab('BOUGHT')}
                    className={`pb-2 relative ${activeTab === 'BOUGHT' ? 'text-tiffany' : 'text-gray-400'}`}
                  >
                    已買清單
                    {activeTab === 'BOUGHT' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-tiffany rounded-full" />}
                  </button>
                </div>
                
                <select 
                  className="text-xs border-none bg-transparent text-gray-500 font-medium focus:ring-0 cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                >
                  <option value="LATEST">最近新增</option>
                  <option value="RATING">想買程度</option>
                  <option value="CATEGORY">依類別</option>
                  <option value="BRAND">依牌子</option>
                </select>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-20 pt-2 px-3">
              <ItemList 
                items={filteredItems} 
                onItemClick={(id) => setView({ type: 'DETAIL', itemId: id })}
                onDelete={handleDeleteItem}
                onToggleStatus={handleToggleStatus}
              />
              {filteredItems.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <ShoppingBag className="w-12 h-12 mb-2 opacity-20" />
                  <p className="text-sm">暫無項目</p>
                </div>
              )}
            </div>

            {/* FAB */}
            <button 
              onClick={() => setView({ type: 'ADD' })}
              className="fixed bottom-6 right-6 w-14 h-14 bg-tiffany text-white rounded-full shadow-lg flex items-center justify-center hover:bg-tiffany-dark active:scale-95 transition-all z-20"
            >
              <Plus className="w-7 h-7" />
            </button>
          </div>
        );

      case 'DETAIL': {
        const item = items.find(i => i.id === view.itemId);
        if (!item) return null;
        return (
          <ItemDetail 
            item={item} 
            onBack={() => setView({ type: 'LIST' })}
            onEdit={() => setView({ type: 'EDIT', itemId: item.id })}
            onToggleStatus={() => handleToggleStatus(item.id, item.isBought)}
          />
        );
      }

      case 'ADD':
        return (
          <ItemForm 
            onSave={handleAddItem}
            onCancel={() => setView({ type: 'LIST' })}
          />
        );

      case 'EDIT': {
        const itemToEdit = items.find(i => i.id === view.itemId);
        if (!itemToEdit) return null;
        return (
          <ItemForm 
            initialData={itemToEdit}
            onSave={handleEditItem}
            onCancel={() => setView({ type: 'DETAIL', itemId: itemToEdit.id })}
          />
        );
      }

      case 'FILTER':
        // Extract all available brands for the filter list
        const allBrands = Array.from(new Set(items.map(i => i.brand).filter(Boolean) as string[]));
        return (
          <FilterPage 
            currentFilters={filters}
            availableBrands={allBrands}
            onApply={(newFilters) => {
              setFilters(newFilters);
              setView({ type: 'LIST' });
            }}
            onCancel={() => setView({ type: 'LIST' })}
          />
        );
    }
  };

  return (
    <div className="max-w-md mx-auto h-[100dvh] bg-white shadow-2xl relative overflow-hidden font-sans text-gray-800">
      {renderView()}
      
      <Modal 
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.onConfirm}
        onCancel={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        confirmText={modalConfig.confirmText}
        confirmColor={modalConfig.confirmColor}
      />
    </div>
  );
}