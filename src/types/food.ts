export type FoodCategory = 'ของคาว' | 'ของหวาน' | 'ของกินเล่น';

export type MeatType = 'หมู' | 'ไก่' | 'กุ้ง/ซีฟู้ด' | 'เนื้อวัว' | 'ไม่มีเนื้อสัตว์';

export interface Ingredient {
  name: string;
  amount: string;
  category: 'เนื้อสัตว์/โปรตีน' | 'ผักและสมุนไพร' | 'เครื่องปรุง/เครื่องแกง' | 'แป้ง/น้ำตาล/ของหวาน' | 'อื่นๆ';
}

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  calories: number;
  meatType: MeatType;
  hasVegetables: boolean;
  cookingTime: string;
  description: string;
  image: string;
  ingredients: Ingredient[];
  cookingSteps: string[];
  popular?: boolean;
  featured?: boolean;
}

export type CaloriePreset = 'all' | 'under300' | '300to500' | '500to700' | 'custom';
export type VegFilter = 'all' | 'veg' | 'noveg';
export type MeatFilter = 'all' | 'pork' | 'chicken';

export interface FilterState {
  category: 'ทั้งหมด' | FoodCategory;
  caloriePreset: CaloriePreset;
  customMinCal: number;
  customMaxCal: number;
  vegFilter: VegFilter;
  meatFilter: MeatFilter;
  searchKeyword: string;
}

export interface SpunHistoryItem {
  id: string;
  foodId: string;
  foodName: string;
  foodImage: string;
  category: FoodCategory;
  calories: number;
  spunAt: string; // ISO string
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'member' | 'admin';
  profileImage: string;
  favorites: string[]; // food IDs
  history: SpunHistoryItem[];
  spinCount: number;
  joinedDate: string;
  preferredMeat?: MeatFilter;
  preferredVeg?: VegFilter;
  status?: 'active' | 'suspended';
}
