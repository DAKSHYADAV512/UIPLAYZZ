import React, { useState } from 'react';
import { X, Send, ShieldCheck, CheckCircle2, Sparkles, FileCode, AlertCircle } from 'lucide-react';
import { GameCategory, LicenseType } from '../types/game.ts';
import { storage } from '../services/storage.ts';
import { playUiClick } from '../utils/sound.ts';

interface DeveloperSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}

const CATEGORIES: GameCategory[] = [
  'Arcade',
  'Action',
  'Adventure',
  'Racing',
  'Puzzle',
  'Strategy',
  'Sports',
  'Platformer',
  'Casual',
  'Multiplayer',
];

const LICENSES: LicenseType[] = [
  'Original Platform License',
  'MIT',
  'Apache 2.0',
  'CC-BY 4.0',
  'GPL 3.0',
  'Proprietary with Permission',
];

export const DeveloperSubmitModal: React.FC<DeveloperSubmitModalProps> = ({
  isOpen,
  onClose,
  onSubmitted,
}) => {
  const [developerName, setDeveloperName] = useState('');
  const [developerEmail, setDeveloperEmail] = useState('');
  const [gameTitle, setGameTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GameCategory>('Arcade');
  const [tagsInput, setTagsInput] = useState('Indie, WebGL, 2D');
  const [gameUrl, setGameUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [controls, setControls] = useState('WASD to move, Space to interact');
  const [licenseType, setLicenseType] = useState<LicenseType>('MIT');
  const [distributionPermission, setDistributionPermission] = useState(
    'Redistribution allowed under explicit developer authorization and open-source terms.'
  );
  const [attributionNote, setAttributionNote] = useState('');
  const [rightsConfirmed, setRightsConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rightsConfirmed) return;

    playUiClick();
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    storage.createSubmission({
      developerName,
      developerEmail,
      gameTitle,
      description,
      category,
      tags,
      gameUrl,
      thumbnailUrl:
        thumbnailUrl.trim() ||
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      controls,
      licenseType,
      distributionPermission,
      attributionNote,
      rightsConfirmed,
    });

    setSubmitted(true);
    if (onSubmitted) onSubmitted();

    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0f1424] border border-violet-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/80 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/50 hover:bg-slate-800"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-2xl font-black text-white">Submission Received!</h3>
            <div className="p-4 rounded-xl bg-violet-950/40 border border-violet-500/30 max-w-md mx-auto text-xs text-slate-300 leading-relaxed">
              Your game <strong className="text-cyan-300">{gameTitle}</strong> has entered our{' '}
              <strong className="text-amber-300">PENDING REVIEW</strong> queue. Our platform
              administrators will verify license clearance and build integrity before publishing it to the public catalog.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 text-white shadow-lg shadow-purple-950">
                <FileCode className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-xl text-white">Submit a Game</h3>
                <p className="text-xs text-slate-400">
                  Publish your HTML5, WebGL, or Canvas browser game to UNIPLAYZZ
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Developer Name / Studio *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CyberVortex Games"
                  value={developerName}
                  onChange={(e) => setDeveloperName(e.target.value)}
                  className="w-full bg-[#0a0d18] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Developer Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="contact@studio.com"
                  value={developerEmail}
                  onChange={(e) => setDeveloperEmail(e.target.value)}
                  className="w-full bg-[#0a0d18] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Game Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gravity Shift 2D"
                  value={gameTitle}
                  onChange={(e) => setGameTitle(e.target.value)}
                  className="w-full bg-[#0a0d18] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GameCategory)}
                  className="w-full bg-[#0a0d18] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Description *
              </label>
              <textarea
                rows={2}
                required
                placeholder="Give players an overview of gameplay, storyline, and mechanics..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#0a0d18] border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Game URL / Build Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://your-domain.com/game/index.html"
                  value={gameUrl}
                  onChange={(e) => setGameUrl(e.target.value)}
                  className="w-full bg-[#0a0d18] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Thumbnail Image URL
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  className="w-full bg-[#0a0d18] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Controls Guide
                </label>
                <input
                  type="text"
                  placeholder="Arrows to steer, Space to jump"
                  value={controls}
                  onChange={(e) => setControls(e.target.value)}
                  className="w-full bg-[#0a0d18] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Sci-Fi, Fast, Pixel"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full bg-[#0a0d18] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Legal & License Section */}
            <div className="p-4 rounded-2xl bg-[#0a0d19] border border-slate-800 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-violet-300 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-violet-400" />
                Legal & Distribution Rights Clearance
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    License Type *
                  </label>
                  <select
                    value={licenseType}
                    onChange={(e) => setLicenseType(e.target.value as LicenseType)}
                    className="w-full bg-[#12182b] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {LICENSES.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Attribution Notice (if applicable)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Created by Studio X"
                    value={attributionNote}
                    onChange={(e) => setAttributionNote(e.target.value)}
                    className="w-full bg-[#12182b] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Distribution Permission Details *
                </label>
                <input
                  type="text"
                  required
                  value={distributionPermission}
                  onChange={(e) => setDistributionPermission(e.target.value)}
                  className="w-full bg-[#12182b] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <label className="flex items-start gap-2.5 pt-1 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={rightsConfirmed}
                  onChange={(e) => setRightsConfirmed(e.target.checked)}
                  className="mt-0.5 accent-cyan-500 w-4 h-4 rounded"
                />
                <span>
                  <strong>I certify that I hold the legal rights or explicit license</strong> to distribute this game on UNIPLAYZZ. I understand commercial copyright infringements are strictly prohibited.
                </span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!rightsConfirmed}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  rightsConfirmed
                    ? 'bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white shadow-lg shadow-cyan-500/30'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" /> Submit for Review
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
