import React, { useState, useEffect } from 'react';
import { usePantryStore } from '../store/pantryStore';
import { useNutritionStore } from '../store/nutritionStore';
import { ChefHat, Youtube, Clock, ChefHatIcon, Loader2, Utensils, Check, AlertCircle, ShoppingCart } from 'lucide-react';
import { generateRecipes } from '../lib/gemini';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { GroceryList } from '../components/GroceryList';
import { CarpoolMap } from '../components/CarpoolMap';

interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  videoUrl: string;
  difficulty: 'easy' | 'medium' | 'hard';
  prepTime: string;
  cookTime: string;
  calories: number;
  servings: number;
  nutritionInfo: {
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
  };
}

export function RecipesPage() {
  const { items, removeItem, updateQuantity, addToGroceryList } = usePantryStore();
  const { addLog } = useNutritionStore();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [cookingComplete, setCookingComplete] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    async function fetchRecipes() {
      if (items.length === 0) {
        setRecipes([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const ingredients = items.map(item => item.name);
        const generatedRecipes = await generateRecipes(ingredients);
        setRecipes(generatedRecipes);
      } catch (err) {
        console.error('Failed to generate recipes:', err);
        setError('Failed to generate recipes. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, [items]);

  const handleAddToGroceryList = (ingredient: string) => {
    addToGroceryList({
      name: ingredient,
      quantity: 1,
      addedBy: 'Current User', // In a real app, get from auth
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const handleNextStep = () => {
    if (selectedRecipe && currentStep < selectedRecipe.instructions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else if (selectedRecipe && currentStep === selectedRecipe.instructions.length - 1) {
      setCookingComplete(true);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleCompleteCooking = () => {
    if (!selectedRecipe) return;
    
    addLog({
      calories: selectedRecipe.calories,
      protein: parseInt(selectedRecipe.nutritionInfo.protein),
      carbs: parseInt(selectedRecipe.nutritionInfo.carbs),
      fat: parseInt(selectedRecipe.nutritionInfo.fat),
      fiber: parseInt(selectedRecipe.nutritionInfo.fiber),
    });

    selectedRecipe.ingredients.forEach(ingredient => {
      const matchingItem = items.find(item => 
        item.name.toLowerCase().includes(ingredient.toLowerCase())
      );
      
      if (matchingItem) {
        if (matchingItem.quantity > 1) {
          updateQuantity(matchingItem.id, matchingItem.quantity - 1);
        } else {
          removeItem(matchingItem.id);
        }
      }
    });

    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
      setSelectedRecipe(null);
      setCookingComplete(false);
      setCurrentStep(0);
    }, 3000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-center mb-8">
            <ChefHat className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">Recipe Suggestions</h1>
          </div>

          {showConfirmation && (
            <div className="fixed top-4 right-4 bg-green-100 text-green-800 p-4 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in">
              <Check className="h-5 w-5" />
              <span>Recipe completed! Pantry and nutrition updated.</span>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              <span className="ml-2 text-gray-600">Generating recipes...</span>
            </div>
          )}

          {error && (
            <div className="text-center text-red-600 py-8">
              {error}
            </div>
          )}

          {!loading && !error && recipes.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              Add some ingredients to your pantry to get recipe suggestions!
            </div>
          )}

          {selectedRecipe ? (
            <div className="bg-white rounded-xl shadow-lg p-6">
              {!cookingComplete && (
                <button
                  onClick={() => {
                    setSelectedRecipe(null);
                    setCurrentStep(0);
                  }}
                  className="mb-4 text-blue-600 hover:text-blue-700"
                >
                  ← Back to recipes
                </button>
              )}

              <h2 className="text-2xl font-semibold mb-4">{selectedRecipe.title}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Nutrition Info (per serving)</h3>
                  <div className="space-y-1 text-sm">
                    <p>Calories: {selectedRecipe.calories}</p>
                    <p>Protein: {selectedRecipe.nutritionInfo.protein}</p>
                    <p>Carbs: {selectedRecipe.nutritionInfo.carbs}</p>
                    <p>Fat: {selectedRecipe.nutritionInfo.fat}</p>
                    <p>Fiber: {selectedRecipe.nutritionInfo.fiber}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Cooking Info</h3>
                  <div className="space-y-1 text-sm">
                    <p>Prep Time: {selectedRecipe.prepTime}</p>
                    <p>Cook Time: {selectedRecipe.cookTime}</p>
                    <p>Servings: {selectedRecipe.servings}</p>
                    <p className={getDifficultyColor(selectedRecipe.difficulty)}>
                      Difficulty: {selectedRecipe.difficulty}
                    </p>
                  </div>
                </div>
              </div>

              {cookingComplete ? (
                <div className="text-center py-8">
                  <div className="mb-6">
                    <Check className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                      Cooking Complete!
                    </h3>
                    <p className="text-gray-600">
                      Great job! Would you like to update your nutrition log and pantry?
                    </p>
                  </div>
                  <button
                    onClick={handleCompleteCooking}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Complete & Update
                  </button>
                </div>
              ) : (
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Current Step ({currentStep + 1}/{selectedRecipe.instructions.length})</h3>
                  <div className="bg-blue-50 p-4 rounded-lg text-lg">
                    {selectedRecipe.instructions[currentStep]}
                  </div>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={handlePreviousStep}
                      disabled={currentStep === 0}
                      className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
                    >
                      Previous Step
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      {currentStep === selectedRecipe.instructions.length - 1 ? 'Finish Cooking' : 'Next Step'}
                    </button>
                  </div>
                </div>
              )}

              {!cookingComplete && selectedRecipe.instructions.length > 0 && (
                <VoiceAssistant
                  currentStep={currentStep}
                  instructions={selectedRecipe.instructions}
                  onNextStep={handleNextStep}
                  onPreviousStep={handlePreviousStep}
                />
              )}
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {recipes.map((recipe, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-semibold mb-4">{recipe.title}</h2>
                  
                  <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Prep: {recipe.prepTime}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Cook: {recipe.cookTime}</span>
                    </div>
                    <div className={`flex items-center ${getDifficultyColor(recipe.difficulty)}`}>
                      <ChefHatIcon className="h-4 w-4 mr-1" />
                      <span className="capitalize">{recipe.difficulty}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <Utensils className="h-4 w-4 mr-2" />
                      <span className="font-medium">Nutrition (per serving):</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <p>Calories: {recipe.calories}</p>
                      <p>Protein: {recipe.nutritionInfo.protein}</p>
                      <p>Carbs: {recipe.nutritionInfo.carbs}</p>
                      <p>Fat: {recipe.nutritionInfo.fat}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Ingredients:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {recipe.ingredients.map((ingredient, idx) => {
                        const available = items.some(item => 
                          item.name.toLowerCase().includes(ingredient.toLowerCase())
                        );
                        return (
                          <li key={idx} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className={available ? 'text-green-600' : 'text-gray-500'}>
                                {ingredient}
                              </span>
                              {available ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <button
                                  onClick={() => handleAddToGroceryList(ingredient)}
                                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                                >
                                  <ShoppingCart className="h-4 w-4" />
                                  <span className="text-sm">Add to List</span>
                                </button>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() => setSelectedRecipe(recipe)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Start Cooking
                    </button>

                    <a
                      href={recipe.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                    >
                      <Youtube className="h-5 w-5" />
                      <span>Watch Video</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <GroceryList />
          <CarpoolMap />
        </div>
      </div>
    </div>
  );
}