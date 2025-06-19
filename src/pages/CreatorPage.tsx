import React, { useState } from 'react';
import { Camera, Upload, Star, Trophy } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

export function CreatorPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    specialties: [] as string[],
    upiId: '',
    accountType: 'individual'
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      // Handle profile picture upload
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit creator application
    setStep(step + 1);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8">Become a Creator</h1>

        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Basic Information</h2>
            <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500">
              <input {...getInputProps()} />
              <Camera className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">Upload your profile picture</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Specialties</label>
                <div className="mt-2 space-x-2">
                  {['Nutrition', 'Fitness', 'Mental Health', 'Weight Loss', 'Recovery'].map((specialty) => (
                    <label key={specialty} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.specialties.includes(specialty)}
                        onChange={(e) => {
                          const specialties = e.target.checked
                            ? [...formData.specialties, specialty]
                            : formData.specialties.filter(s => s !== specialty);
                          setFormData({ ...formData, specialties });
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{specialty}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Payment Setup</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Type</label>
                <select
                  value={formData.accountType}
                  onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="individual">Individual</option>
                  <option value="business">Business</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">UPI ID</label>
                <input
                  type="text"
                  value={formData.upiId}
                  onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                  placeholder="username@bank"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Complete Setup
              </button>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-8">
            <Trophy className="mx-auto h-16 w-16 text-yellow-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Application Submitted!</h2>
            <p className="text-gray-600 mb-6">
              We'll review your application and get back to you within 48 hours.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => window.location.href = '/explore'}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Return to Explore
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}