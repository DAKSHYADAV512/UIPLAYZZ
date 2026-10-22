import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle } from 'lucide-react';
import { Game, GameReport } from '../types/game.ts';
import { storage } from '../services/storage.ts';
import { playUiClick } from '../utils/sound.ts';

interface ReportModalProps {
  game: Game;
  isOpen: boolean;
  onClose: () => void;
}

const REPORT_REASONS: GameReport['reason'][] = [
  'Game does not load',
  'Broken controls',
  'Copyright/rights concern',
  'Inappropriate content',
  'Other',
];

export const ReportModal: React.FC<ReportModalProps> = ({ game, isOpen, onClose }) => {
  const [reason, setReason] = useState<GameReport['reason']>('Game does not load');
  const [details, setDetails] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playUiClick();

    storage.submitReport({
      gameId: game.id,
      gameTitle: game.title,
      reason,
      details: details.trim() || 'No additional details provided.',
      reporterEmail: email.trim() || undefined,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#0f1424] border border-rose-500/40 rounded-3xl p-6 shadow-2xl shadow-rose-950/50">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/50 hover:bg-slate-800"
          aria-label="Close report dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-xl font-bold text-white">Report Submitted</h3>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              Thank you for keeping UNIPLAYZZ safe and functioning. Our platform administrators will review this report promptly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white">Report Game</h3>
                <p className="text-xs text-slate-400">
                  Reporting: <span className="text-slate-200 font-semibold">{game.title}</span>
                </p>
              </div>
            </div>

            {/* Reason selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                What issue did you encounter?
              </label>
              <div className="space-y-2">
                {REPORT_REASONS.map((r) => (
                  <label
                    key={r}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer text-xs transition-colors ${
                      reason === r
                        ? 'bg-rose-950/40 border-rose-500/60 text-white font-bold'
                        : 'bg-[#121727] border-slate-700/60 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={r}
                      checked={reason === r}
                      onChange={() => setReason(r)}
                      className="accent-rose-500"
                    />
                    <span>{r}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Details */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Additional Details (optional)
              </label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe what happened or why this game should be checked..."
                className="w-full bg-[#0a0d18] border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your Email (for updates, optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="pilot@example.com"
                className="w-full bg-[#0a0d18] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition-all"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
