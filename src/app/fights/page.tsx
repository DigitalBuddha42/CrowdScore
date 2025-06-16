'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/trpc/react';
import { FightStatus } from '@prisma/client';
import { Search, Filter, Plus } from 'lucide-react';
import { toast } from 'react-toastify';

export default function FightsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FightStatus | 'all'>('all');

  const { data: fights, isLoading } = useQuery({
    queryKey: ['fights'],
    queryFn: () => api.fights.getAll.query(),
  });

  const filteredFights = fights?.filter((fight) => {
    const matchesSearch =
      fight.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fight.fighter1.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fight.fighter2.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fight.weightClass.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || fight.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Fights</h1>
        <button
          onClick={() => toast.info('Coming soon!')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Fight
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search fights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as FightStatus | 'all')}
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredFights?.map((fight) => (
          <div
            key={fight.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => window.location.href = `/fights/${fight.id}`}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100">
                {fight.weightClass}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  fight.status === 'live'
                    ? 'bg-red-100 text-red-800'
                    : fight.status === 'upcoming'
                    ? 'bg-blue-100 text-blue-800'
                    : fight.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {fight.status.charAt(0).toUpperCase() + fight.status.slice(1)}
              </span>
            </div>
            <h2 className="text-xl font-semibold mb-2">{fight.eventName}</h2>
            <div className="flex justify-between items-center mb-4">
              <div className="text-center flex-1">
                <p className="font-medium">{fight.fighter1}</p>
                <p className="text-sm text-gray-500">vs</p>
                <p className="font-medium">{fight.fighter2}</p>
              </div>
            </div>
            {fight.startTime && (
              <p className="text-sm text-gray-500">
                {new Date(fight.startTime).toLocaleString()}
              </p>
            )}
          </div>
        ))}
      </div>

      {filteredFights?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No fights found matching your criteria.</p>
        </div>
      )}
    </div>
  );
} 