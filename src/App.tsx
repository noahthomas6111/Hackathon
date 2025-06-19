import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ShoppingBasket, BookOpen, LineChart, Compass, UserCircle } from 'lucide-react';
import { PantryPage } from './pages/PantryPage';
import { RecipesPage } from './pages/RecipesPage';
import { NutritionPage } from './pages/NutritionPage';
import { ExplorePage } from './components/ExplorePage';
import { ProfilePage } from './pages/ProfilePage';
import { CreatorPage } from './pages/CreatorPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                <ShoppingBasket className="h-6 w-6" />
                <span className="font-semibold">Pantry</span>
              </Link>
              <Link to="/recipes" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                <BookOpen className="h-6 w-6" />
                <span className="font-semibold">Recipes</span>
              </Link>
              <Link to="/nutrition" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                <LineChart className="h-6 w-6" />
                <span className="font-semibold">Nutrition</span>
              </Link>
              <Link to="/explore" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                <Compass className="h-6 w-6" />
                <span className="font-semibold">Explore</span>
              </Link>
            </div>
            <Link to="/profile" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
              <UserCircle className="h-6 w-6" />
              <span className="font-semibold">Profile</span>
            </Link>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<PantryPage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/nutrition" element={<NutritionPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/creator" element={<CreatorPage />} />
      </Routes>
    </div>
  );
}

export default App;