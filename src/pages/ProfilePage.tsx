import React from 'react';
import { usePantryStore } from '../store/pantryStore';
import { Award, Share2, Trophy, Star } from 'lucide-react';
import { FacebookShareButton, TwitterShareButton } from 'react-share';

export function ProfilePage() {
  const { userPoints, badges } = usePantryStore();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div 
          className="h-48 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=1200)' }}
        />
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white -mt-12">
                {userPoints}
              </div>
              <div>
                <h1 className="text-2xl font-bold">Your Profile</h1>
                <div className="flex items-center text-gray-600">
                  <Trophy className="h-5 w-5 text-yellow-400 mr-2" />
                  <span>Level {Math.floor(userPoints / 100) + 1}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Your Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={badge.image}
                      alt={badge.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold">{badge.name}</h3>
                      <p className="text-sm text-gray-600">{badge.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Earned {new Date(badge.unlockedAt!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end space-x-2">
                    <FacebookShareButton
                      url={window.location.href}
                      quote={`I earned the ${badge.name} badge! 🌟`}
                    >
                      <button className="text-blue-600 hover:text-blue-700">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </FacebookShareButton>
                    <TwitterShareButton
                      url={window.location.href}
                      title={`I earned the ${badge.name} badge! 🌟`}
                    >
                      <button className="text-blue-400 hover:text-blue-500">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </TwitterShareButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}