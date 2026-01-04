import React, { useState, useRef, useEffect } from 'react';
import { Item } from '../types';
import { Trash2, CheckCircle, MapPin, Star } from 'lucide-react';

interface Props {
  item: Item;
  onClick: () => void;
  onSwipeLeft: () => void;  // Delete
  onSwipeRight: () => void; // Toggle Status
}

const SwipeableItem: React.FC<Props> = ({ item, onClick, onSwipeLeft, onSwipeRight }) => {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  
  // Constants
  const THRESHOLD = 100; // px to trigger action
  const MAX_SWIPE = 150; // visual limit

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    currentX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;
    
    // Limit visuals
    let newTranslate = diff;
    if (newTranslate > MAX_SWIPE) newTranslate = MAX_SWIPE + (newTranslate - MAX_SWIPE) * 0.2;
    if (newTranslate < -MAX_SWIPE) newTranslate = -MAX_SWIPE + (newTranslate + MAX_SWIPE) * 0.2;

    setTranslateX(newTranslate);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    if (translateX > THRESHOLD) {
      // Swipe Right -> Toggle
      onSwipeRight();
    } else if (translateX < -THRESHOLD) {
      // Swipe Left -> Delete
      onSwipeLeft();
    }
    
    // Reset position nicely
    setTranslateX(0);
  };

  // Reset if component unmounts or props change significantly
  useEffect(() => {
    setTranslateX(0);
  }, [item.isBought]);

  const bgStyle = {
    transform: `translateX(${translateX}px)`,
    transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
  };

  // Determine background color based on swipe direction hint
  const isRightHint = translateX > 30;
  const isLeftHint = translateX < -30;

  return (
    <div className="relative w-full h-28 rounded-xl overflow-hidden select-none shadow-sm mb-3">
      {/* Background Actions Layer */}
      <div className="absolute inset-0 flex justify-between items-center px-6">
        {/* Left Side (Revealed when swiping Right) - Toggle Status */}
        <div className={`flex items-center gap-2 font-medium transition-opacity duration-200 ${isRightHint ? 'opacity-100' : 'opacity-0'} text-white z-0 absolute left-0 top-0 bottom-0 w-1/2 pl-6 bg-tiffany`}>
          <CheckCircle className="w-6 h-6" />
          <span>{item.isBought ? '標記未買' : '標記已買'}</span>
        </div>

        {/* Right Side (Revealed when swiping Left) - Delete */}
        <div className={`flex items-center justify-end gap-2 font-medium transition-opacity duration-200 ${isLeftHint ? 'opacity-100' : 'opacity-0'} text-white z-0 absolute right-0 top-0 bottom-0 w-1/2 pr-6 bg-red-500`}>
          <span>刪除</span>
          <Trash2 className="w-6 h-6" />
        </div>
      </div>

      {/* Foreground Content */}
      <div 
        ref={containerRef}
        className="absolute inset-0 bg-white p-3 flex gap-3 z-10 active:scale-[0.98] transition-transform duration-100"
        style={bgStyle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => {
          // Prevent click if we were swiping
          if (Math.abs(translateX) < 5) onClick();
        }}
      >
        {/* Thumbnail */}
        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-gray-800 truncate text-base leading-tight">{item.name}</h3>
            {item.rating >= 4 && (
                <div className="flex text-yellow-400 text-[10px] gap-0.5">
                    {[...Array(item.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-1 mt-1">
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-full">
              {item.category}
            </span>
            <span className="px-2 py-0.5 bg-tiffany/10 text-tiffany-dark text-[10px] rounded-full flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5" />
              {item.country}
            </span>
          </div>

          <div className="mt-1 flex justify-between items-end">
             {item.brand && <span className="text-xs text-gray-400 truncate max-w-[120px]">{item.brand}</span>}
             {item.quantity > 1 && (
                 <span className="text-xs font-bold text-gray-800 bg-gray-100 px-1.5 rounded">x{item.quantity}</span>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwipeableItem;