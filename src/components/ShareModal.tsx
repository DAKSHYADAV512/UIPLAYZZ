import React, { useState } from 'react';
import { X, Copy, Check, Share2, Sparkles, ExternalLink } from 'lucide-react';
import { Game } from '../types/game.ts';
import { playUiClick } from '../utils/sound.ts';

interface ShareModalProps {
  game: Game;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ game, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://uniplayzz.com';
  const shareUrl = `${origin}/game/${game.slug}`;

  const handleCopy = () => {
    playUiClick();
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#0f1424] border border-violet-500/40 rounded-3xl p-6 shadow-2xl shadow-purple-950/80">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/50 hover:bg-slate-800"
          aria-label="Close share dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-violet-950 border border-violet-500/30 text-violet-400">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-white">Share Game</h3>
            <p className="text-xs text-slate-400">Send this game to your friends</p>
          </div>
        </div>

        {/* Social Card Preview */}
        <div className="mb-6 rounded-2xl overflow-hidden border border-slate-700/60 bg-[#090d18]">
          <div className="relative aspect-[16/9] w-full bg-slate-900">
            <img
              src={game.thumbnailUrl}
              alt={game.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded-md text-[10px] font-black text-violet-300 border border-violet-500/30">
              UNIPLAYZZ EXCLUSIVE
            </div>
          </div>
          <div className="p-3.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                {game.category}
              </span>
              <span className="text-xs text-amber-400 font-bold">
                ⭐ {game.rating.toFixed(1)}
              </span>
            </div>
            <h4 className="font-black text-white text-base line-clamp-1">{game.title}</h4>
            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">by {game.developer}</p>
          </div>
        </div>

        {/* Share Link Input & Copy */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Shareable URL</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full bg-[#090d18] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 select-all focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/30'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copy Link
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
