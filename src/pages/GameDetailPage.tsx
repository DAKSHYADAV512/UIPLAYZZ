import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Star,
  Eye,
  Calendar,
  ShieldCheck,
  Share2,
  AlertTriangle,
  Heart,
  Gamepad2,
  Tag,
  Sparkles,
  Info,
} from 'lucide-react';
import { Game } from '../types/game.ts';
import { GamePlayer } from '../components/GamePlayer.tsx';
import { RatingStars } from '../components/RatingStars.tsx';
import { FavoriteButton } from '../components/FavoriteButton.tsx';
import { ShareModal } from '../components/ShareModal.tsx';
import { ReportModal } from '../components/ReportModal.tsx';
import { Leaderboard } from '../components/Leaderboard.tsx';
import { GameCard } from '../components/GameCard.tsx';
import { storage } from '../services/storage.ts';
import { auth } from '../services/auth.ts';
import { formatPlayCount } from '../utils/scoring.ts';
import { playUiClick } from '../utils/sound.ts';

interface GameDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
  onSelectGame: (slug: string) => void;
  favorites: string[];
  onToggleFavorite: (gameId: string) => void;
}

export const GameDetailPage: React.FC<GameDetailPageProps> = ({
  slug,
  onNavigate,
  onSelectGame,
  favorites,
  onToggleFavorite,
}) => {
  const [game, setGame] = useState<Game | undefined>(() => storage.getGameBySlug(slug));
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [leaderboardEntries, setLeaderboardEntries] = useState(() =>
    game ? storage.getLeaderboard(game.id) : []
  );

  const currentUser = auth.getCurrentUser();
  const userId = currentUser?.id || 'guest';

  useEffect(() => {
    const found = storage.getGameBySlug(slug);
    setGame(found);
    if (found) {
      setUserRating(storage.getUserRating(found.id, userId));
      setLeaderboardEntries(storage.getLeaderboard(found.id));
    }
  }, [slug, userId]);

  if (!game) {
    return (
      <div className="py-24 text-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
          <Gamepad2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white">Game Not Found</h2>
        <p className="text-xs text-slate-400">
          The requested game slug does not exist or may have been unpublished.
        </p>
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs"
        >
          <ChevronLeft className="w-4 h-4" /> Return to Catalog
        </button>
      </div>
    );
  }

  const handleRate = (newStar: number) => {
    const updated = storage.submitRating(game.id, userId, newStar);
    setGame((prev) =>
      prev ? { ...prev, rating: updated.rating, ratingsCount: updated.count } : prev
    );
    setUserRating(newStar);
  };

  const refreshLeaderboard = () => {
    if (game) {
      setLeaderboardEntries(storage.getLeaderboard(game.id));
    }
  };

  // Related games
  const allGames = storage.getGames();
  const relatedGames = allGames
    .filter((g) => g.published && g.category === game.category && g.id !== game.id)
    .slice(0, 4);

  return (
    <div className="space-y-10">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            playUiClick();
            onNavigate('/');
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0f1424] hover:bg-[#151c32] border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <button
            onClick={() => onNavigate(`/games/${game.category.toLowerCase()}`)}
            className="hover:text-cyan-400 font-semibold"
          >
            {game.category}
          </button>
          <span>/</span>
          <span className="text-white font-semibold truncate max-w-[150px] sm:max-w-none">
            {game.title}
          </span>
        </div>
      </div>

      {/* Main Browser Game Player */}
      <section aria-label="Game Player">
        <GamePlayer
          game={game}
          onOpenReport={() => setReportModalOpen(true)}
          onOpenShare={() => setShareModalOpen(true)}
          onScoreSubmitted={refreshLeaderboard}
        />
      </section>

      {/* Game Details Bar: Title, Meta, Actions */}
      <section className="bg-[#0f1424] border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
                {game.category}
              </span>
              {game.isOriginal && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-violet-950/80 text-violet-300 border border-violet-500/40">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" /> UNIPLAYZZ ORIGINAL
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {game.licenseType}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white">
              {game.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-400">
              <span>
                Developer: <strong className="text-slate-200">{game.developer}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                {formatPlayCount(game.playCount)} Plays
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {game.releaseDate}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <FavoriteButton
              isFavorite={favorites.includes(game.id)}
              onToggle={() => onToggleFavorite(game.id)}
            />

            <button
              onClick={() => {
                playUiClick();
                setShareModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#121727] hover:bg-[#1a2138] border border-slate-700/60 text-slate-200 text-xs font-bold transition-colors"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>

            <button
              onClick={() => {
                playUiClick();
                setReportModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 text-xs font-medium transition-colors"
              title="Report Issue"
            >
              <AlertTriangle className="w-4 h-4" /> Report
            </button>
          </div>
        </div>

        {/* Description & Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-2">
                About the Game
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {game.description}
              </p>
            </div>

            {/* Controls Guide */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-cyan-400" /> Controls & Instructions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {game.controls.map((ctrl, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#090d18] border border-slate-800 text-xs"
                  >
                    <span className="font-mono font-bold text-cyan-300 bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700">
                      {ctrl.key}
                    </span>
                    <span className="text-slate-300 font-medium">{ctrl.action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4 text-violet-400" /> Game Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {game.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-semibold rounded-lg bg-[#090d18] text-slate-300 border border-slate-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Legal / License Box */}
            <div className="p-4 rounded-2xl bg-[#090d18] border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> Verified Distribution Clearance
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong>License:</strong> {game.licenseType} • <strong>Permission:</strong>{' '}
                {game.distributionPermission}
              </p>
              {game.attribution && (
                <p className="text-[11px] text-slate-500 italic">
                  Attribution: {game.attribution}
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Rating Box & Leaderboard */}
          <div className="space-y-6">
            {/* Interactive Rating Box */}
            <div className="bg-[#090d18] border border-slate-800 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Rate this Game
              </h4>
              <RatingStars
                currentRating={game.rating}
                ratingsCount={game.ratingsCount}
                userRating={userRating}
                onRate={handleRate}
              />
            </div>

            {/* Leaderboard */}
            <Leaderboard
              gameId={game.id}
              entries={leaderboardEntries}
              onRefresh={refreshLeaderboard}
            />
          </div>
        </div>
      </section>

      {/* Related Games in Same Category */}
      {relatedGames.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-white">
              More {game.category} Games
            </h3>
            <button
              onClick={() => onNavigate(`/games/${game.category.toLowerCase()}`)}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-bold"
            >
              View All {game.category} →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedGames.map((g) => (
              <GameCard
                key={g.id}
                game={g}
                onSelectGame={onSelectGame}
                isFavorite={favorites.includes(g.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </section>
      )}

      {/* Modals */}
      <ShareModal
        game={game}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />

      <ReportModal
        game={game}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
    </div>
  );
};
