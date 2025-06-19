import React, { useState } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { PantryList } from '../components/PantryList';
import { ShoppingBasket } from 'lucide-react';
import { usePantryStore } from '../store/pantryStore';
import { analyzeReceipt } from '../lib/gemini';

export function PantryPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = usePantryStore();

  const handleImageUpload = async (file: File) => {
    setIsProcessing(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          try {
            const items = await analyzeReceipt(e.target.result as string);
            
            if (items.length === 0) {
              setError('No items were found in the receipt. Please try another image.');
            } else {
              items.forEach(item => addItem(item));
            }
          } catch (error) {
            console.error('Error analyzing receipt:', error);
            setError('Failed to analyze the receipt. Please try again.');
          } finally {
            setIsProcessing(false);
          }
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing image:', error);
      setError('Failed to process the image. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-center mb-8">
        <ShoppingBasket className="h-8 w-8 text-blue-600 mr-2" />
        <h1 className="text-3xl font-bold text-gray-900">Smart Pantry Scanner</h1>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <ImageUploader onImageUpload={handleImageUpload} />
        
        {isProcessing && (
          <div className="mt-4 text-center text-gray-600">
            Processing your receipt...
          </div>
        )}

        {error && (
          <div className="mt-4 text-center text-red-600">
            {error}
          </div>
        )}

        <PantryList />
      </div>
    </div>
  );
}