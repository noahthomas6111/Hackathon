import React, { useState } from 'react';
import { Star, Lock, Heart, MessageCircle, Share2, Trophy } from 'lucide-react';
import { UPIPayment } from './UPIPayment';
import { useNavigate } from 'react-router-dom';
import type { Artist } from '../types';

const SAMPLE_ARTISTS: Artist[] = [
  {
    id: '1',
    name: 'Alex Chen',
    bio: 'Professional nutritionist and fitness expert with 10+ years of experience',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    coverImage: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200',
    specialties: ['Nutrition', 'Weight Loss', 'Meal Planning'],
    followers: 125000,
    isSubscribed: false,
    content: [
      {
        id: 'c1',
        title: 'Ultimate Guide to Sustainable Weight Loss',
        type: 'diet-plan',
        preview: 'Learn the secrets to maintaining a healthy weight while enjoying your favorite foods...',
        likes: 2300,
        comments: 156,
        createdAt: new Date('2025-03-10')
      }
    ]
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    bio: 'Olympic athlete turned wellness coach',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200',
    specialties: ['Athletic Performance', 'Mental Health', 'Recovery'],
    followers: 89000,
    isSubscribed: true,
    content: [
      {
        id: 'c2',
        title: 'Recovery Techniques for Peak Performance',
        type: 'tips',
        preview: 'Essential recovery strategies I learned as an Olympic athlete...',
        fullContent: 'Full content available for subscribers',
        likes: 1800,
        comments: 92,
        createdAt: new Date('2025-03-12')
      }
    ]
  }
];

export function ExplorePage() {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [showUPIModal, setShowUPIModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ amount: number; period: string } | null>(null);
  const navigate = useNavigate();

  const handleSubscribe = (amount: number, period: string) => {
    setSelectedPlan({ amount, period });
    setShowUPIModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowUPIModal(false);
    setShowSubscribeModal(false);
    // Update subscription status
  };

  const handleBecomeCreator = () => {
    navigate('/creator');
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Explore</h1>
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleBecomeCreator}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full hover:opacity-90 transition-opacity"
          >
            Become a Creator
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SAMPLE_ARTISTS.map((artist) => (
          <div key={artist.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div 
              className="h-48 bg-cover bg-center"
              style={{ backgroundImage: `url(${artist.coverImage})` }}
            />
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={artist.avatar}
                    alt={artist.name}
                    className="w-16 h-16 rounded-full border-4 border-white -mt-12"
                  />
                  <div>
                    <h3 className="font-semibold text-xl">{artist.name}</h3>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span>{artist.followers.toLocaleString()} followers</span>
                    </div>
                  </div>
                </div>
                {artist.isSubscribed ? (
                  <Trophy className="h-6 w-6 text-yellow-400" />
                ) : (
                  <button
                    onClick={() => setShowSubscribeModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition-colors"
                  >
                    Subscribe
                  </button>
                )}
              </div>

              <p className="text-gray-600 mt-4 text-sm">{artist.bio}</p>

              <div className="flex flex-wrap gap-2 mt-4">
                {artist.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
                  >
                    {specialty}
                  </span>
                ))}
              </div>

              <div className="mt-6 space-y-4">
                {artist.content.map((content) => (
                  <div
                    key={content.id}
                    className="border rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{content.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{content.preview}</p>
                      </div>
                      {!artist.isSubscribed && (
                        <Lock className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center hover:text-red-600">
                          <Heart className="h-4 w-4 mr-1" />
                          <span>{content.likes}</span>
                        </button>
                        <button className="flex items-center hover:text-blue-600">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          <span>{content.comments}</span>
                        </button>
                        <button className="flex items-center hover:text-green-600">
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                      <span>{new Date(content.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showSubscribeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4">Subscribe to Premium</h2>
            <p className="text-gray-600 mb-6">
              Get unlimited access to exclusive content from top creators.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => handleSubscribe(999, 'month')}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Monthly - ₹999/month
              </button>
              <button
                onClick={() => handleSubscribe(9999, 'year')}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Yearly - ₹9,999/year (Save 17%)
              </button>
              <button
                onClick={() => setShowSubscribeModal(false)}
                className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showUPIModal && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <UPIPayment
            amount={selectedPlan.amount}
            upiId="creator@upi"
            description={`Premium Subscription (${selectedPlan.period})`}
            onSuccess={handlePaymentSuccess}
            onCancel={() => setShowUPIModal(false)}
          />
        </div>
      )}
    </div>
  );
}