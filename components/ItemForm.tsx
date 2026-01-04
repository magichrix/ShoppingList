import React, { useState, useRef } from 'react';
import { Item, CATEGORIES, COUNTRIES, Category, Country } from '../types';
import { ArrowLeft, Upload, X, Star } from 'lucide-react';

interface Props {
  initialData?: Item;
  onSave: (item: Item) => void;
  onCancel: () => void;
}

const ItemForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [image, setImage] = useState<string>(initialData?.image || '');
  const [category, setCategory] = useState<Category>(initialData?.category || CATEGORIES[0]);
  const [country, setCountry] = useState<Country>(initialData?.country || COUNTRIES[0]);
  const [rating, setRating] = useState(initialData?.rating || 3);
  const [brand, setBrand] = useState(initialData?.brand || '');
  const [quantity, setQuantity] = useState(initialData?.quantity || 1);
  const [shop, setShop] = useState(initialData?.shop || '');
  const [url, setUrl] = useState(initialData?.url || '');
  const [note, setNote] = useState(initialData?.note || '');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !image) {
      alert('請填寫名稱並上傳圖片');
      return;
    }

    const newItem: Item = {
      id: initialData?.id || Date.now().toString(),
      name,
      image,
      category,
      country,
      rating,
      brand,
      quantity,
      shop,
      url,
      note,
      isBought: initialData ? initialData.isBought : false,
      createdAt: initialData ? initialData.createdAt : Date.now(),
    };

    onSave(newItem);
  };

  return (
    <div className="flex flex-col h-full bg-white animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-20">
        <div className="flex items-center gap-3">
            <button onClick={onCancel} className="text-gray-500 p-2 -ml-2 rounded-full hover:bg-gray-100">
                <X className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-bold text-gray-800">{initialData ? '編輯項目' : '新增想買'}</h2>
        </div>
        <button 
            onClick={handleSubmit}
            className="text-tiffany font-bold px-2 py-1 disabled:opacity-50"
            disabled={!name || !image}
        >
            儲存
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 no-scrollbar">
        <form className="space-y-6">
            
            {/* Image Upload */}
            <div className="flex justify-center">
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-32 h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden relative transition-all ${image ? 'border-transparent' : 'border-gray-300 bg-gray-50'}`}
                >
                    {image ? (
                        <>
                            <img src={image} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs font-bold">更換</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <Upload className="w-8 h-8 text-gray-400 mb-1" />
                            <span className="text-xs text-gray-400">上傳圖片</span>
                        </>
                    )}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                    />
                </div>
            </div>

            {/* Name */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">名稱 <span className="text-red-500">*</span></label>
                <input 
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="例如：EVE 止痛藥"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tiffany focus:outline-none"
                />
            </div>

            {/* Category & Country */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">類別 <span className="text-red-500">*</span></label>
                    <select 
                        value={category}
                        onChange={e => setCategory(e.target.value as Category)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tiffany focus:outline-none appearance-none"
                    >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">國家 <span className="text-red-500">*</span></label>
                    <select 
                        value={country}
                        onChange={e => setCountry(e.target.value as Country)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tiffany focus:outline-none appearance-none"
                    >
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            {/* Rating */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">想買程度</label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                        <button 
                            key={star} 
                            type="button"
                            onClick={() => setRating(star)}
                            className="focus:outline-none transition-transform active:scale-110"
                        >
                            <Star className={`w-8 h-8 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                        </button>
                    ))}
                </div>
            </div>

            {/* Brand & Quantity */}
            <div className="flex gap-4">
                 <div className="flex-1">
                    <label className="block text-sm font-bold text-gray-700 mb-1">牌子</label>
                    <input 
                        type="text" 
                        value={brand}
                        onChange={e => setBrand(e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tiffany focus:outline-none"
                    />
                </div>
                <div className="w-24">
                    <label className="block text-sm font-bold text-gray-700 mb-1">數量</label>
                    <input 
                        type="number" 
                        min="1"
                        value={quantity}
                        onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tiffany focus:outline-none text-center"
                    />
                </div>
            </div>

             {/* Shop & URL */}
             <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">購買店舖</label>
                    <input 
                        type="text" 
                        value={shop}
                        onChange={e => setShop(e.target.value)}
                        placeholder="例如：Donki, Olive Young"
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tiffany focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">網站連結 (URL)</label>
                    <input 
                        type="url" 
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tiffany focus:outline-none"
                    />
                </div>
             </div>

             {/* Note */}
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">備註</label>
                <textarea 
                    rows={4}
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="例如：要買大包裝..."
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tiffany focus:outline-none resize-none"
                />
            </div>
            
            <div className="h-10" /> {/* Bottom spacer */}
        </form>
      </div>
    </div>
  );
};

export default ItemForm;