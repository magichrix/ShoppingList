import React from 'react';
import { Item } from '../types';
import { ArrowLeft, Star, MapPin, Tag, ShoppingBag, Edit2, ExternalLink, Check } from 'lucide-react';

interface Props {
  item: Item;
  onBack: () => void;
  onEdit: () => void;
  onToggleStatus: () => void;
}

const ItemDetail: React.FC<Props> = ({ item, onBack, onEdit, onToggleStatus }) => {
  return (
    <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-300">
      {/* Navbar with overlay absolute position for aesthetic or standard */}
      <div className="absolute top-0 left-0 w-full z-20 p-4 flex justify-between items-start pointer-events-none">
        <button 
          onClick={onBack}
          className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full shadow-md flex items-center justify-center text-gray-700 pointer-events-auto active:scale-95 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={onEdit}
          className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full shadow-md flex items-center justify-center text-tiffany pointer-events-auto active:scale-95 transition"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>

      {/* Hero Image */}
      <div className="w-full h-[45vh] bg-gray-100 relative">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 -mt-6 relative z-10 flex flex-col pb-6 overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-start mb-2">
            <div>
                 <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-1">{item.name}</h1>
                 <div className="flex gap-1 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                    <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < item.rating ? 'fill-current' : 'text-gray-300'}`} 
                    />
                    ))}
                 </div>
            </div>
             {item.quantity > 1 && (
                <div className="flex flex-col items-center justify-center bg-gray-100 px-3 py-1 rounded-lg">
                    <span className="text-xs text-gray-400 uppercase">Qty</span>
                    <span className="text-xl font-bold text-gray-800">{item.quantity}</span>
                </div>
            )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6 mt-3">
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" />
            {item.category}
          </span>
          <span className="px-3 py-1 bg-tiffany/10 text-tiffany-dark text-sm rounded-full flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            {item.country}
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-xs text-gray-400 block mb-1">牌子 Brand</span>
                <span className="font-medium text-gray-800">{item.brand || '-'}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-xs text-gray-400 block mb-1">購買地點 Shop</span>
                <span className="font-medium text-gray-800">{item.shop || '-'}</span>
            </div>
        </div>

        {/* Note */}
        {item.note && (
            <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-900 mb-2">備註</h3>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                    {item.note}
                </p>
            </div>
        )}

        {/* URL Button if exists */}
        {item.url && (
            <a 
                href={item.url} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between w-full p-4 mb-6 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-600 active:bg-gray-100"
            >
                <span className="truncate pr-4">{item.url}</span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
        )}

        <div className="flex-1" /> {/* Spacer */}

        {/* Main Action Button */}
        <button
          onClick={onToggleStatus}
          className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all ${
            item.isBought 
              ? 'bg-white border-2 border-tiffany text-tiffany' 
              : 'bg-tiffany text-white'
          }`}
        >
          {item.isBought ? (
            <>
              <Check className="w-6 h-6" />
              已放入行李 (標記未買)
            </>
          ) : (
            <>
              <ShoppingBag className="w-6 h-6" />
              標記已買
            </>
          )}
        </button>

      </div>
    </div>
  );
};

export default ItemDetail;