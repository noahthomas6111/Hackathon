import { create } from 'zustand';
import { PantryStore, PantryItem, GroceryItem, CarpoolEvent, Badge } from '../types';

const POINTS_PER_CARPOOL = 50;
const CARBON_SAVINGS_PER_CARPOOL = 2.5; // kg CO2

const BADGES: Badge[] = [
  {
    id: 'eco-starter',
    name: 'Eco Starter',
    description: 'Join your first carpool',
    image: 'https://images.unsplash.com/photo-1523289217630-0dd16184af8e?w=100',
    pointsRequired: 50
  },
  {
    id: 'green-warrior',
    name: 'Green Warrior',
    description: 'Save 10kg of CO2 through carpooling',
    image: 'https://images.unsplash.com/photo-1516796181074-bf453fbfa3e6?w=100',
    pointsRequired: 200
  },
  {
    id: 'carpool-champion',
    name: 'Carpool Champion',
    description: 'Complete 10 carpools',
    image: 'https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=100',
    pointsRequired: 500
  }
];

export const usePantryStore = create<PantryStore>((set, get) => ({
  items: [],
  groceryList: [],
  carpoolEvents: [],
  userPoints: 0,
  badges: [],
  
  addItem: (item) =>
    set((state) => ({
      items: [
        ...state.items,
        {
          ...item,
          id: crypto.randomUUID(),
          addedAt: new Date(),
        },
      ],
    })),
    
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
    
  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    })),

  addToGroceryList: (item) =>
    set((state) => ({
      groceryList: [
        ...state.groceryList,
        {
          ...item,
          id: crypto.randomUUID(),
          addedAt: new Date(),
        },
      ],
    })),

  removeFromGroceryList: (id) =>
    set((state) => ({
      groceryList: state.groceryList.filter((item) => item.id !== id),
    })),

  createCarpoolEvent: (event) =>
    set((state) => ({
      carpoolEvents: [
        ...state.carpoolEvents,
        {
          ...event,
          id: crypto.randomUUID(),
          carbonSaved: CARBON_SAVINGS_PER_CARPOOL * event.maxParticipants
        },
      ],
    })),

  joinCarpoolEvent: (eventId, participant) => {
    const store = get();
    const event = store.carpoolEvents.find(e => e.id === eventId);
    
    if (event && !event.participants.includes(participant)) {
      set((state) => ({
        carpoolEvents: state.carpoolEvents.map((e) =>
          e.id === eventId
            ? {
                ...e,
                participants: [...e.participants, participant],
              }
            : e
        ),
      }));

      // Add points for joining carpool
      store.addPoints(POINTS_PER_CARPOOL);

      // Check for badge unlocks
      const totalCarpools = store.carpoolEvents.filter(e => 
        e.participants.includes(participant)
      ).length;

      const totalCarbonSaved = store.carpoolEvents
        .filter(e => e.participants.includes(participant))
        .reduce((acc, e) => acc + (e.carbonSaved || 0), 0);

      // Check for badge unlocks
      BADGES.forEach(badge => {
        if (!store.badges.find(b => b.id === badge.id)) {
          if (
            (badge.id === 'eco-starter' && totalCarpools === 1) ||
            (badge.id === 'green-warrior' && totalCarbonSaved >= 10) ||
            (badge.id === 'carpool-champion' && totalCarpools >= 10)
          ) {
            store.unlockBadge(badge);
          }
        }
      });
    }
  },

  addPoints: (points) =>
    set((state) => ({
      userPoints: state.userPoints + points
    })),

  unlockBadge: (badge) =>
    set((state) => ({
      badges: [...state.badges, { ...badge, unlockedAt: new Date() }]
    })),
}));