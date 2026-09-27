import { FoodItem, UserProfile } from '../types/food';
import { SAVORY_FOODS } from './savoryFoods';
import { DESSERT_FOODS } from './dessertFoods';
import { SNACK_FOODS } from './snackFoods';

export const INITIAL_FOODS: FoodItem[] = [
  ...SAVORY_FOODS,
  ...DESSERT_FOODS,
  ...SNACK_FOODS
];

export const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'user-01',
    name: 'น้องเฟิร์ส (นักชิมตัวจริง)',
    email: 'first.student@foodapp.th',
    role: 'member',
    profileImage: '/src/assets/images/chef_mascot_avatar_1790511468417.jpg',
    favorites: ['s-01', 'd-01', 'k-01', 's-02'],
    history: [
      {
        id: 'hist-1',
        foodId: 's-01',
        foodName: 'ผัดกะเพราหมูสับไข่ดาว',
        foodImage: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=800&q=80',
        category: 'ของคาว',
        calories: 580,
        spunAt: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: 'hist-2',
        foodId: 'd-01',
        foodName: 'ข้าวเหนียวมะม่วงอกร่องทอง',
        foodImage: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
        category: 'ของหวาน',
        calories: 450,
        spunAt: new Date(Date.now() - 3600000 * 24).toISOString()
      }
    ],
    spinCount: 14,
    joinedDate: '2026-09-01',
    preferredMeat: 'all',
    preferredVeg: 'all',
    status: 'active'
  },
  {
    id: 'admin-01',
    name: 'ครูผู้ดูแลระบบ (Admin Chef)',
    email: 'admin@firstautofood.th',
    role: 'admin',
    profileImage: '/src/assets/images/chef_mascot_avatar_1790511468417.jpg',
    favorites: ['s-03', 'd-02', 'k-02'],
    history: [
      {
        id: 'hist-admin-1',
        foodId: 's-03',
        foodName: 'แกงเขียวหวานไก่ยอดมะพร้าว',
        foodImage: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=800&q=80',
        category: 'ของคาว',
        calories: 480,
        spunAt: new Date(Date.now() - 3600000 * 5).toISOString()
      }
    ],
    spinCount: 42,
    joinedDate: '2026-08-15',
    preferredMeat: 'all',
    preferredVeg: 'all',
    status: 'active'
  }
];
