import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { usePantryStore } from '../store/pantryStore';
import { Users, Clock, MapPin, Award, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import Confetti from 'react-confetti';
import { FacebookShareButton, TwitterShareButton } from 'react-share';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 40.7128,
  lng: -74.0060
};

export function CarpoolMap() {
  const { carpoolEvents, joinCarpoolEvent, userPoints, badges } = usePantryStore();
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [showBadgeNotification, setShowBadgeNotification] = useState(false);
  const [newBadge, setNewBadge] = useState<any>(null);
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const handleJoinCarpool = (eventId: string) => {
    const prevBadges = badges.length;
    joinCarpoolEvent(eventId, 'Current User');
    
    // Check if new badge was earned
    if (badges.length > prevBadges) {
      setNewBadge(badges[badges.length - 1]);
      setShowBadgeNotification(true);
      setTimeout(() => setShowBadgeNotification(false), 5000);
    }
    
    setSelectedEvent(null);
  };

  if (!isLoaded) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading map...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {showBadgeNotification && newBadge && (
        <>
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
          />
          <div className="fixed top-4 right-4 bg-green-100 text-green-800 p-4 rounded-lg shadow-lg animate-bounce">
            <div className="flex items-center space-x-3">
              <Award className="h-6 w-6" />
              <div>
                <p className="font-semibold">New Badge Unlocked!</p>
                <p>{newBadge.name}</p>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Active Carpools</h2>
        <div className="flex items-center space-x-4">
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center">
            <Award className="h-4 w-4 mr-2" />
            <span>{userPoints} Points</span>
          </div>
        </div>
      </div>

      <div className="mb-4 overflow-x-auto">
        <div className="flex space-x-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="flex-shrink-0 bg-white border rounded-lg p-3 w-32 text-center"
            >
              <img
                src={badge.image}
                alt={badge.name}
                className="w-16 h-16 mx-auto mb-2 rounded-full"
              />
              <p className="font-medium text-sm">{badge.name}</p>
              <p className="text-xs text-gray-500">{badge.description}</p>
              <div className="mt-2 flex justify-center space-x-2">
                <FacebookShareButton
                  url={window.location.href}
                  quote={`I just earned the ${badge.name} badge for eco-friendly carpooling!`}
                >
                  <button className="text-blue-600 hover:text-blue-700">
                    <Share2 className="h-4 w-4" />
                  </button>
                </FacebookShareButton>
                <TwitterShareButton
                  url={window.location.href}
                  title={`I just earned the ${badge.name} badge for eco-friendly carpooling! 🌱`}
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

      <div className="relative">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          options={{
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
              }
            ]
          }}
        >
          {carpoolEvents.map((event) => {
            const isFull = event.participants.length >= event.maxParticipants;
            return (
              <React.Fragment key={event.id}>
                <Marker
                  position={event.location}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: isFull ? '#EF4444' : '#10B981',
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: '#FFFFFF',
                  }}
                  onClick={() => setSelectedEvent(event.id)}
                />
                
                {selectedEvent === event.id && (
                  <InfoWindow
                    position={event.location}
                    onCloseClick={() => setSelectedEvent(null)}
                  >
                    <div className="p-2 min-w-[200px]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-blue-600 mr-1" />
                          <span className="font-medium">
                            {event.participants.length}/{event.maxParticipants} joined
                          </span>
                        </div>
                        <span className={`text-sm px-2 py-1 rounded ${
                          isFull ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {isFull ? 'Full' : 'Available'}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{format(event.date, 'MMM d, h:mm a')}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{event.location.address}</span>
                        </div>
                        {event.carbonSaved && (
                          <div className="text-sm text-green-600">
                            🌱 Saves {event.carbonSaved.toFixed(1)}kg CO2
                          </div>
                        )}
                      </div>
                      
                      {!isFull && !event.participants.includes('Current User') && (
                        <button
                          onClick={() => handleJoinCarpool(event.id)}
                          className="w-full bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          Join Carpool (+50 points)
                        </button>
                      )}
                      
                      {event.participants.includes('Current User') && (
                        <div className="text-center text-sm text-green-600">
                          You're part of this carpool!
                        </div>
                      )}
                    </div>
                  </InfoWindow>
                )}
              </React.Fragment>
            );
          })}
        </GoogleMap>
      </div>
    </div>
  );
}