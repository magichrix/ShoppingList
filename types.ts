export type Country = '日本' | '韓國' | '台灣' | '香港' | '其他';

export const COUNTRIES: Country[] = ['日本', '韓國', '台灣', '香港', '其他'];

export type Category = 
  | '藥品' 
  | '化妝品' 
  | '保養品' 
  | '零食' 
  | '日用品' 
  | '精品' 
  | '其他';

export const CATEGORIES: Category[] = [
  '藥品', '化妝品', '保養品', '零食', '日用品', '精品', '其他'
];

export interface Item {
  id: string;
  name: string;
  image: string; // Blob URL or Placeholder
  category: Category;
  country: Country;
  url?: string;
  rating: number; // 1-5
  brand?: string;
  quantity: number;
  shop?: string;
  note?: string;
  isBought: boolean;
  createdAt: number;
}

export type SortOption = 'LATEST' | 'RATING' | 'CATEGORY' | 'BRAND';

export interface FilterState {
  categories: Category[];
  country: Country | null;
  brands: string[];
}
