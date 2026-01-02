'use client';

import { StateData } from '@/types';

interface StateSelectorProps {
  states: StateData[];
  selectedState: string;
  onStateChange: (slug: string) => void;
}

export default function StateSelector({ states, selectedState, onStateChange }: StateSelectorProps) {
  return (
    <div className="w-full max-w-md">
      <label htmlFor="state-select" className="block text-sm font-medium text-gray-700 mb-2">
        Select Your State
      </label>
      <select
        id="state-select"
        value={selectedState}
        onChange={(e) => onStateChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
      >
        <option value="">Choose a state...</option>
        {states.map((state) => (
          <option key={state.slug} value={state.slug}>
            {state.name}
          </option>
        ))}
      </select>
    </div>
  );
}
