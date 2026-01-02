import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import statesData from '@/data/states.json';
import { StateData } from '@/types';

// Generate static paths for all states
export async function generateStaticParams() {
  return statesData.map((state) => ({
    slug: state.slug,
  }));
}

// Revalidate every 24 hours
export const revalidate = 86400;

// Generate metadata for each state page
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const state = statesData.find((s) => s.slug === slug);
  
  if (!state) {
    return {
      title: 'State Not Found',
    };
  }

  return {
    title: `${state.name} Medical Card Eligibility | Medical Card Checker`,
    description: `Check medical card eligibility requirements for ${state.name}. Age requirement: ${state.ageRequirement}+, Card fee: $${state.cardFee}.`,
  };
}

export default async function StatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const state: StateData | undefined = statesData.find((s) => s.slug === slug);

  if (!state) {
    notFound();
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white px-8 py-12">
            <h1 className="text-4xl font-bold mb-2">{state.name}</h1>
            <p className="text-blue-100">Medical Card Eligibility Information</p>
          </div>

          {/* Content */}
          <div className="px-8 py-10">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Age Requirement */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-2">
                  <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900">Age Requirement</h3>
                </div>
                <p className="text-3xl font-bold text-blue-600">{state.ageRequirement}+ years</p>
              </div>

              {/* Card Fee */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-2">
                  <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900">Card Fee</h3>
                </div>
                <p className="text-3xl font-bold text-blue-600">
                  {state.cardFee === 0 ? 'Free' : `$${state.cardFee}`}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Program Details</h2>
              <p className="text-gray-700 leading-relaxed">{state.description}</p>
            </div>

            {/* Action Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/state/${state.slug}/apply`}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-center transition-all shadow-md hover:shadow-lg"
              >
                Start Evaluation
              </Link>
              <Link
                href="/"
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-8 py-4 rounded-lg text-center transition-all"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
