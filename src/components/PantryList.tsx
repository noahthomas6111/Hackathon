import React from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { usePantryStore } from '../store/pantryStore';

export function PantryList() {
  const { items, removeItem, updateQuantity } = usePantryStore();

  // Sort items by expiration date (expired items first, then soon-to-expire)
  const sortedItems = [...items].sort((a, b) => {
    if (!a.expirationDate && !b.expirationDate) return 0;
    if (!a.expirationDate) return 1;
    if (!b.expirationDate) return -1;
    return a.expirationDate.getTime() - b.expirationDate.getTime();
  });

  const getExpirationStatus = (date?: Date) => {
    if (!date) return null;
    const now = new Date();
    const daysUntilExpiration = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiration < 0) return 'expired';
    if (daysUntilExpiration <= 3) return 'expiring-soon';
    return 'good';
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Pantry Items</h2>
      {sortedItems.length === 0 ? (
        <p className="text-gray-500 text-center">No items in your pantry yet</p>
      ) : (
        <ul className="space-y-3">
          {sortedItems.map((item) => {
            const status = getExpirationStatus(item.expirationDate);
            const statusColors = {
              expired: 'bg-red-50 border-red-200',
              'expiring-soon': 'bg-yellow-50 border-yellow-200',
              good: 'bg-white'
            };
            
            return (
              <li
                key={item.id}
                className={`flex items-center justify-between p-4 rounded-lg shadow border ${
                  status ? statusColors[status] : 'bg-white'
                }`}
              >
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Added: {item.addedAt.toLocaleDateString()}</p>
                    <p>Price: ${item.price.toFixed(2)}</p>
                    {item.expirationDate && (
                      <p className={`font-medium ${
                        status === 'expired' ? 'text-red-500' :
                        status === 'expiring-soon' ? 'text-orange-500' :
                        'text-green-500'
                      }`}>
                        <span className="inline-flex items-center">
                          {status === 'expired' || status === 'expiring-soon' ? (
                            <AlertTriangle className="h-4 w-4 mr-1" />
                          ) : null}
                          Expires: {item.expirationDate.toLocaleDateString()}
                        </span>
                      </p>
                    )}
                    {item.storageInfo && (
                      <p className="text-blue-600 animate-pulse">
                        Storage Tip: {item.storageInfo}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
                    className="w-20 px-2 py-1 border rounded"
                  />
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}