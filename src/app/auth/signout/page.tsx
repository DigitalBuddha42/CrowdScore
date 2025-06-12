'use client';

import { signOut } from 'next-auth/react';

export default function SignOut() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Sign out
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to sign out?
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <button
            onClick={() => signOut()}
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
} 