export interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  expirationDate?: Date;
  addedAt: Date;
  isVegetable: boolean;
  storageInfo?: string;
  nutritionInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  addedAt: Date;
  addedBy: string;
}

export interface CarpoolEvent {
  id: string;
  organizer: string;
  date: Date;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  participants: string[];
  maxParticipants: number;
  status: 'planned' | 'in-progress' | 'completed';
  carbonSaved?: number;
}

export interface PantryStore {
  items: PantryItem[];
  groceryList: GroceryItem[];
  carpoolEvents: CarpoolEvent[];
  userPoints: number;
  badges: Badge[];
  addItem: (item: Omit<PantryItem, 'id' | 'addedAt'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  addToGroceryList: (item: Omit<GroceryItem, 'id' | 'addedAt'>) => void;
  removeFromGroceryList: (id: string) => void;
  createCarpoolEvent: (event: Omit<CarpoolEvent, 'id'>) => void;
  joinCarpoolEvent: (eventId: string, participant: string) => void;
  addPoints: (points: number) => void;
  unlockBadge: (badge: Badge) => void;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  pointsRequired: number;
  unlockedAt?: Date;
}

export interface Artist {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  coverImage: string;
  specialties: string[];
  followers: number;
  isSubscribed: boolean;
  content: ArtistContent[];
}

export interface ArtistContent {
  id: string;
  title: string;
  type: 'diet-plan' | 'tips' | 'workout';
  preview: string;
  fullContent?: string;
  likes: number;
  comments: number;
  createdAt: Date;
}

export interface UserProfile {
  height: number;
  weight: number;
  age: number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  dietaryRestrictions: string[];
  goals: 'maintain' | 'lose' | 'gain';
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  points?: number;
  badges?: Badge[];
}

export interface NutritionLog {
  date: Date;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface DietPlan {
  dailyCalories: number;
  macroSplit: {
    protein: number;
    carbs: number;
    fat: number;
  };
  recommendations: {
    category: string;
    foods: string[];
    reason: string;
  }[];
}