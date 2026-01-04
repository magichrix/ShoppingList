import React from 'react';
import { Item } from '../types';
import SwipeableItem from './SwipeableItem';

interface Props {
  items: Item[];
  onItemClick: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
}

const ItemList: React.FC<Props> = ({ items, onItemClick, onDelete, onToggleStatus }) => {
  return (
    <div className="space-y-3">
      {items.map(item => (
        <SwipeableItem 
          key={item.id} 
          item={item} 
          onClick={() => onItemClick(item.id)}
          onSwipeLeft={() => onDelete(item.id)}
          onSwipeRight={() => onToggleStatus(item.id, item.isBought)}
        />
      ))}
    </div>
  );
};

export default ItemList;