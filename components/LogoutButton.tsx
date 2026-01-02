'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LogoutButton() {
  const router = useRouter();
  const { logout, session } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  if (!session) return null;

  return (
    <div className="flex items-center gap-4">
      <div className="text-sm">
        <p className="font-semibold">{session.username}</p>
        <p className="text-blue-100">{session.role}</p>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition-all"
      >
        Logout
      </button>
    </div>
  );
}
