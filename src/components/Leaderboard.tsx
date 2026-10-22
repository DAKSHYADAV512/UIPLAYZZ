import React, { useState } from 'react';
import { Trophy, Medal, ShieldCheck, Plus, Sparkles } from 'lucide-react';
import { LeaderboardEntry } from '../types/game.ts';
import { storage } from '../services/storage.ts';
import { auth } from '../services/auth.ts';
import { validateGameScore } from '../utils/scoring.ts';
import { playUiClick } from '../utils/sound.ts';

interface LeaderboardProps {
  gameId: string;
  entries: LeaderboardEntry[];
  onRefresh: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  gameId,
  entries,
  onRefresh,
}) => {
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [pilotName, setPilotName] = useState(auth.getCurrentUser()?.displayName || '');
  const [manualScore, setManualScore] = useState('');
  const [submitError, setSubmitError] = useState('');

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playUiClick();
    const scoreVal = parseInt(manualScore, 10);

    const validation = validateGameScore(gameId, scoreVal, 60);
    if (!validation.valid) {
      setSubmitError(validation.reason || 'Invalid score.');
      return;
    }

    storage.submitScore({
      gameId,
      playerName: pilotName.trim() || 'Anonymous Pilot',
      score: scoreVal,
    });

    setShowSubmitModal(false);
    setManualScore('');
    setSubmitError('');
    onRefresh();
  };

  return (
    <div className="bg-[#0f1424] border border-violet-500/20 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-white text-base">Spire Hall of Fame</h3>
            <p className="text-[11px] text-slate-400">Top verified scores</p>
          </div>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Submit Score
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="py-8 text-center text-slate-500 text-xs">
          No records yet. Be the first to claim the top spot!
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, idx) => {
            const isTop1 = idx === 0;
            const isTop2 = idx === 1;
            const isTop3 = idx === 2;

            return (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-all ${
                  isTop1
                    ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                    : isTop2
                    ? 'bg-slate-800/40 border-slate-600/40 text-slate-200'
                    : isTop3
                    ? 'bg-orange-950/20 border-orange-500/30 text-orange-200'
                    : 'bg-[#121727]/60 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 text-center font-black">
                    {isTop1 ? (
                      <Medal className="w-4 h-4 text-amber-400 inline" />
                    ) : isTop2 ? (
                      <Medal className="w-4 h-4 text-slate-300 inline" />
                    ) : isTop3 ? (
                      <Medal className="w-4 h-4 text-orange-400 inline" />
                    ) : (
                      <span className="text-slate-500 font-bold">#{idx + 1}</span>
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-white block">{entry.playerName}</span>
                    <span className="text-[10px] text-slate-400">{entry.achievedAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {entry.verified && (
                    <span
                      className="hidden sm:flex items-center gap-0.5 text-[10px] text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30 font-medium"
                      title="Verified high score"
                    >
                      <ShieldCheck className="w-3 h-3" /> VERIFIED
                    </span>
                  )}
                  <span className="font-black text-sm text-cyan-400 tracking-wider">
                    {entry.score.toLocaleString()} pts
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Manual Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-sm bg-[#0f1424] border border-cyan-500/40 rounded-3xl p-6 shadow-2xl">
            <h4 className="font-black text-base text-white mb-1">Submit Game Score</h4>
            <p className="text-xs text-slate-400 mb-4">
              Leaderboard validation rules enforce gameplay limits to prevent tampering.
            </p>

            <form onSubmit={handleManualSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Pilot Name</label>
                <input
                  type="text"
                  required
                  value={pilotName}
                  onChange={(e) => setPilotName(e.target.value)}
                  className="w-full bg-[#0a0d18] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Score</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={5000000}
                  placeholder="e.g. 12500"
                  value={manualScore}
                  onChange={(e) => setManualScore(e.target.value)}
                  className="w-full bg-[#0a0d18] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              {submitError && (
                <p className="text-xs text-rose-400 font-semibold">{submitError}</p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white"
                >
                  Post Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
