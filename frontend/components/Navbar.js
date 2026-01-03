'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { authAPI } from '@/lib/api';
import { removeAuthToken, getCurrentUser } from '@/lib/auth';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      removeAuthToken();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      removeAuthToken();
      router.push('/login');
    }
  };

  if (loading) {
    return null;
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-2xl font-bold text-primary-600">
              QueueLess
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <>
                <span className="text-gray-700">
                  {user.name} {user.role === 'ADMIN' && <span className="text-primary-600">(Admin)</span>}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

