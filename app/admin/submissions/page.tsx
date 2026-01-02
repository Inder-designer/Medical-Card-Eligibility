import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import statesData from '@/data/states.json';
import { AdminProtected } from '@/components/AdminProtected';
import LogoutButton from '@/components/LogoutButton';

export const metadata: Metadata = {
  title: 'Admin - Submissions | Medical Card Checker',
  description: 'View all medical card application submissions.',
};

async function getSubmissions() {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    const submissionsPath = path.join(process.cwd(), 'data', 'submissions.json');
    
    try {
      const data = await fs.readFile(submissionsPath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  } catch {
    return [];
  }
}

async function AdminSubmissionsContent() {
  const submissions = await getSubmissions();

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white px-8 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Application Submissions</h1>
              <p className="text-blue-100 mt-1">Manage and review all medical card applications</p>
            </div>
            <LogoutButton />
          </div>

          {/* Stats */}
          <div className="bg-blue-50 px-8 py-4 border-b border-blue-100">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Total Submissions:</span>
              <span className="text-lg font-bold text-blue-600">{submissions.length}</span>
            </div>
          </div>

          {/* Table */}
          <div className="p-8">
            {submissions.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No submissions yet</h3>
                <p className="mt-1 text-sm text-gray-500">Applications will appear here once submitted.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        State
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Age
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Submitted
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {submissions.map((submission: any) => {
                      const state = statesData.find(s => s.slug === submission.state);
                      return (
                        <tr key={submission.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{submission.fullName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{submission.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {state?.name || submission.state}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{submission.age}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {new Date(submission.submittedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminProtected>
      <AdminSubmissionsContent />
    </AdminProtected>
  );
}
