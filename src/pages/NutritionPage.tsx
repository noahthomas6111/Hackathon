import React from 'react';
import { UserProfileForm } from '../components/UserProfileForm';
import { NutritionDashboard } from '../components/NutritionDashboard';

export function NutritionPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <UserProfileForm />
      <NutritionDashboard />
    </div>
  );
}