'use client';

import { useParams } from 'next/navigation';
import { Edit, Trash2, Clock, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import type { Fight, Scorecard, Round } from '@prisma/client';
import { api } from '@/lib/trpc/react';

interface ScorecardWithRelations extends Scorecard {
  user: {
    id: string;
    name: string | null;
  };
  rounds: Round[];
}

interface FightWithRelations extends Fight {
  scorecards: ScorecardWithRelations[];
  judgeScores: {
    id: string;
    judgeName: string;
    roundNumber: number;
    fighter1Score: number;
    fighter2Score: number;
  }[];
}

export default function FightDetailPage() {
  const { id } = useParams();

  const { data: fight, isLoading } = api.fights.getById.useQuery({ id: id as string });
  const { data: scorecards } = api.scorecards.getByFightId.useQuery({ fightId: id as string });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!fight) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Fight not found</h1>
          <p className="mt-2 text-gray-600">The fight you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    toast.info('Edit functionality coming soon!');
  };

  const handleDelete = () => {
    toast.info('Delete functionality coming soon!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{fight.eventName}</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {fight.startTime ? new Date(fight.startTime).toLocaleDateString() : 'TBD'}
              </span>
              {fight.startTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(fight.startTime).toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">{fight.fighter1}</h2>
            <div className="text-sm text-gray-600">
              {fight.weightClass}
            </div>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">{fight.fighter2}</h2>
            <div className="text-sm text-gray-600">
              {fight.weightClass}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Fight Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-medium">
                {fight.status.charAt(0).toUpperCase() + fight.status.slice(1)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Rounds</p>
              <p className="font-medium">{fight.rounds}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Scorecards</h3>
          {scorecards && scorecards.length > 0 ? (
            <div className="space-y-4">
              {scorecards.map((scorecard: ScorecardWithRelations) => (
                <div
                  key={scorecard.id}
                  className="p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-medium">{scorecard.user.name}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(scorecard.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {scorecard.rounds.map((round: Round) => (
                      <div key={round.id} className="text-center">
                        <p className="text-sm text-gray-600">Round {round.roundNumber}</p>
                        <p className="font-medium">
                          {round.fighter1Score} - {round.fighter2Score}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No scorecards yet.</p>
          )}
        </div>
      </div>
    </div>
  );
} 