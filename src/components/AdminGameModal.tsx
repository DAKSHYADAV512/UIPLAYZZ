import React, { useState, useEffect } from 'react';
import { X, Save, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { Game, GameCategory, LicenseType } from '../types/game.ts';
import { storage } from '../services/storage.ts';
import { playUiClick } from '../utils/sound.ts';

interface AdminGameModalProps {
  gameToEdit?: Game | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
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

export const AdminGameModal: React.FC<AdminGameModalProps> = ({
  gameToEdit,
  isOpen,
  onClose,
  onSaved,
}) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [developer, setDeveloper] = useState('');
  const [category, setCategory] = useState<GameCategory>('Arcade');
  const [tagsInput, setTagsInput] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [gameUrl, setGameUrl] = useState('');
  const [controlsInput, setControlsInput] = useState('');
  const [licenseType, setLicenseType] = useState<LicenseType>('Original Platform License');
  const [distributionPermission, setDistributionPermission] = useState('');
  const [attribution, setAttribution] = useState('');
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  const [rightsConfirmed, setRightsConfirmed] = useState(false);

  useEffect(() => {
    if (gameToEdit) {
      setTitle(gameToEdit.title);
      setSlug(gameToEdit.slug);
      setDescription(gameToEdit.description);
      setDeveloper(gameToEdit.developer);
      setCategory(gameToEdit.category);
      setTagsInput(gameToEdit.tags.join(', '));
      setThumbnailUrl(gameToEdit.thumbnailUrl);
      setGameUrl(gameToEdit.gameUrl);
      setControlsInput(gameToEdit.controls.map((c) => `${c.key}: ${c.action}`).join('\n'));
      setLicenseType(gameToEdit.licenseType);
      setDistributionPermission(gameToEdit.distributionPermission);
      setAttribution(gameToEdit.attribution || '');
      setFeatured(gameToEdit.featured);
      setPublished(gameToEdit.published);
      setRightsConfirmed(true);
    } else {
      setTitle('');
      setSlug('');
      setDescription('');
      setDeveloper('UNIPLAYZZ Studios');
      setCategory('Arcade');
      setTagsInput('Action, Arcade, WebGL');
      setThumbnailUrl('');
      setGameUrl('');
      setControlsInput('Arrows: Move\nSpace: Action');
      setLicenseType('Original Platform License');
      setDistributionPermission('Official UNIPLAYZZ Original Game. Rights verified.');
      setAttribution('');
      setFeatured(false);
      setPublished(true);
      setRightsConfirmed(false);
    }
  }, [gameToEdit, isOpen]);

  if (!isOpen) return null;

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!gameToEdit) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generatedSlug);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rightsConfirmed) return;

    playUiClick();
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    // Parse controls
    const controls = controlsInput
      .split('\n')
      .map((line) => {
        const parts = line.split(':');
        if (parts.length >= 2) {
          return { key: parts[0].trim(), action: parts.slice(1).join(':').trim() };
        }
        return { key: 'Controls', action: line.trim() };
      })
      .filter((c) => c.action);

    const now = new Date().toISOString();
    const gameData: Game = {
      id: gameToEdit?.id || `game-${Date.now()}`,
      title,
      slug: slug || `game-${Date.now()}`,
      description,
      developer,
      category,
      tags,
      thumbnailUrl:
        thumbnailUrl.trim() ||
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      gameUrl,
      controls: controls.length > 0 ? controls : [{ key: 'Play', action: 'Standard browser controls' }],
      rating: gameToEdit?.rating || 5.0,
      ratingsCount: gameToEdit?.ratingsCount || 1,
      playCount: gameToEdit?.playCount || 0,
      releaseDate: gameToEdit?.releaseDate || now.split('T')[0],
      featured,
      published,
      licenseType,
      distributionPermission,
      attribution,
      createdAt: gameToEdit?.createdAt || now,
      updatedAt: now,
      isOriginal: licenseType === 'Original Platform License',
    };

    storage.saveGame(gameData);
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0f1424] border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-950/40 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/50 hover:bg-slate-800"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2.5 rounded-2xl bg-amber-950 border border-amber-500/40 text-amber-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-xl text-white">
              {gameToEdit ? 'Edit Game' : 'Add New Game'}
            </h3>
            <p className="text-xs text-slate-400">
              Admin Game Catalog Management (Instant Database Synchronization)
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full bg-[#0a0d18] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                URL Slug (/game/slug) *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-[#0a0d18] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Developer *</label>
              <input
                type="text"
                required
                value={developer}
                onChange={(e) => setDeveloper(e.target.value)}
                className="w-full bg-[#0a0d18] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GameCategory)}
                className="w-full bg-[#0a0d18] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
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
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description *</label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0a0d18] border border-slate-700 rounded-xl p-2.5 text-xs text-white"
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
                placeholder="/games/space-runner/index.html or external sandbox URL"
                value={gameUrl}
                onChange={(e) => setGameUrl(e.target.value)}
                className="w-full bg-[#0a0d18] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Thumbnail URL *
              </label>
              <input
                type="text"
                required
                placeholder="https://..."
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                className="w-full bg-[#0a0d18] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Controls (one per line, e.g. "Key: Action")
              </label>
              <textarea
                rows={2}
                value={controlsInput}
                onChange={(e) => setControlsInput(e.target.value)}
                className="w-full bg-[#0a0d18] border border-slate-700 rounded-xl p-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full bg-[#0a0d18] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          {/* License & Rights */}
          <div className="p-4 rounded-2xl bg-[#090d18] border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              Legal Rights & Distribution Permission
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">License *</label>
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">Attribution</label>
                <input
                  type="text"
                  value={attribution}
                  onChange={(e) => setAttribution(e.target.value)}
                  className="w-full bg-[#12182b] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Distribution Permission Statement *
              </label>
              <input
                type="text"
                required
                value={distributionPermission}
                onChange={(e) => setDistributionPermission(e.target.value)}
                className="w-full bg-[#12182b] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <label className="flex items-start gap-2 pt-1 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={rightsConfirmed}
                onChange={(e) => setRightsConfirmed(e.target.checked)}
                className="mt-0.5 accent-amber-500 w-4 h-4 rounded"
              />
              <span>
                <strong>Administrator Rights Confirmation:</strong> I confirm UNIPLAYZZ has the legal rights or explicit open-source license to host and distribute this game.
              </span>
            </label>
          </div>

          {/* Visibility & Feature toggles */}
          <div className="flex flex-wrap items-center gap-6 pt-1">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="accent-cyan-500 w-4 h-4 rounded"
              />
              <span>Published (Visible to public)</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="accent-violet-500 w-4 h-4 rounded"
              />
              <span>Featured on Homepage Hero</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
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
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/30'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" /> Save Game
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
