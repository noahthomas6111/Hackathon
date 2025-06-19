import React, { useState } from 'react';
import { ShoppingCart, Trash2, Users, MapPin } from 'lucide-react';
import { usePantryStore } from '../store/pantryStore';
import { format } from 'date-fns';

export function GroceryList() {
  const { groceryList, removeFromGroceryList, createCarpoolEvent } = usePantryStore();
  const [isCreatingCarpool, setIsCreatingCarpool] = useState(false);

  const handleCreateCarpool = () => {
    if ('geolocation' in navigator) {
      setIsCreatingCarpool(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Simulate multiple carpool locations around the user's location
          const baseLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          // Create multiple carpools at slightly different locations
          const locations = [
            { lat: baseLocation.lat, lng: baseLocation.lng },
            { lat: baseLocation.lat + 0.01, lng: baseLocation.lng + 0.01 },
            { lat: baseLocation.lat - 0.01, lng: baseLocation.lng - 0.01 },
          ];

          locations.forEach((location, index) => {
            createCarpoolEvent({
              organizer: 'Current User', // In a real app, get from auth
              date: new Date(Date.now() + (index * 30 * 60 * 1000)), // Stagger times by 30 minutes
              location: {
                lat: location.lat,
                lng: location.lng,
                address: `Location ${index + 1}`, // Would be reverse geocoded in production
              },
              participants: ['Current User'],
              maxParticipants: 4,
              status: 'planned',
            });
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Failed to get your location. Please try again.');
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
      setIsCreatingCarpool(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <ShoppingCart className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold">Grocery List</h2>
        </div>
        <button
          onClick={handleCreateCarpool}
          disabled={isCreatingCarpool}
          className={`flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ${
            isCreatingCarpool ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Users className="h-5 w-5 mr-2" />
          {isCreatingCarpool ? 'Creating...' : 'Create Carpool'}
        </button>
      </div>

      {groceryList.length === 0 ? (
        <p className="text-gray-500 text-center py-4">Your grocery list is empty</p>
      ) : (
        <ul className="space-y-3">
          {groceryList.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">
                  Added: {format(item.addedAt, 'MMM d, yyyy')} by {item.addedBy}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Qty: {item.quantity}</span>
                <button
                  onClick={() => removeFromGroceryList(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}