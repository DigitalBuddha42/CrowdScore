'use client';

import { useSearchParams } from 'next/navigation';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Authentication Error
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {error || 'An error occurred during authentication'}
          </p>
        </div>
      </div>
    </div>
  );
}
