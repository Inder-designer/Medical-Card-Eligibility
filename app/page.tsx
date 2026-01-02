'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StateSelector from '@/components/StateSelector';
import statesData from '@/data/states.json';

export default function HomePage() {
  const [selectedState, setSelectedState] = useState('');
  const router = useRouter();

  const handleCheckEligibility = () => {
    if (selectedState) {
      router.push(`/state/${selectedState}`);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Medical Card Eligibility Checker
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find out if you qualify for a medical card in your state. Select your state below to view specific requirements and begin your application.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="flex flex-col items-center gap-6">
            <StateSelector
              states={statesData}
              selectedState={selectedState}
              onStateChange={setSelectedState}
            />
            
            <button
              onClick={handleCheckEligibility}
              disabled={!selectedState}
              className={`px-8 py-3 rounded-lg font-semibold text-white transition-all ${
                selectedState
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Check Eligibility
            </button>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">50</div>
              <div className="text-sm text-gray-600">States Covered</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600">Application Access</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">Fast</div>
              <div className="text-sm text-gray-600">Response Time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
