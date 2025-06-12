'use client';

import { useSearchParams } from 'next/navigation';

export default function Verify() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {token
              ? 'Please wait while we verify your email...'
              : 'No verification token provided'}
          </p>
        </div>
      </div>
    </div>
  );
} 