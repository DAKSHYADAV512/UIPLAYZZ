import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  RotateCcw,
  AlertTriangle,
  Loader2,
  Gamepad2,
  Share2,
} from 'lucide-react';
import { Game } from '../types/game.ts';
import { storage } from '../services/storage.ts';
import { auth } from '../services/auth.ts';
import { playLaunchGameSound, playUiClick, isSoundEnabled, setSoundEnabled } from '../utils/sound.ts';

interface GamePlayerProps {
  game: Game;
  onOpenReport: () => void;
  onOpenShare: () => void;
  onScoreSubmitted?: (score: number) => void;
}

export const GamePlayer: React.FC<GamePlayerProps> = ({
  game,
  onOpenReport,
  onOpenShare,
  onScoreSubmitted,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Listen to game postMessage events (e.g. scores from canvas games)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'UNIPLAYZZ_SCORE') {
        const score = Number(event.data.score);
        if (!isNaN(score) && score > 0) {
          const user = auth.getCurrentUser();
          const playerName = user?.displayName || 'Browser Champion';
          storage.submitScore({
            gameId: game.id,
            playerName,
            score,
          });
          if (onScoreSubmitted) {
            onScoreSubmitted(score);
          }
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [game.id, onScoreSubmitted]);

  // Track fullscreen change events
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleLaunch = () => {
    playLaunchGameSound();
    setIsPlaying(true);
    setIsLoading(true);
    setHasError(false);
    setIsPaused(false);

    // Increment play count & register recently played
    storage.incrementPlayCount(game.id);
    auth.addRecentlyPlayed(game.id);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleRetry = () => {
    playUiClick();
    setHasError(false);
    setIsLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = game.gameUrl;
    }
  };

  const toggleSound = () => {
    playUiClick();
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);

    // Post to iframe
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'UNIPLAYZZ_TOGGLE_SOUND', enabled: next },
        '*'
      );
    }
  };

  const togglePause = () => {
    playUiClick();
    const next = !isPaused;
    setIsPaused(next);

    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'UNIPLAYZZ_PAUSE' },
        '*'
      );
    }
  };

  const toggleFullscreen = () => {
    playUiClick();
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleReload = () => {
    playUiClick();
    setIsLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full bg-[#070a14] rounded-2xl md:rounded-3xl overflow-hidden border border-violet-500/30 shadow-2xl shadow-black/80 flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : 'aspect-[16/10] sm:aspect-[16/9]'
      }`}
    >
      {/* 1. Unstarted Splash Screen */}
      {!isPlaying && (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
          <img
            src={game.thumbnailUrl}
            alt={game.title}
            className="absolute inset-0 w-full h-full object-cover filter blur-[2px] brightness-50 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070a14] via-[#070a14]/70 to-transparent" />

          <div className="relative z-10 max-w-lg space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/40">
              {game.category} • Browser Ready
            </span>

            <h2 className="text-2xl sm:text-4xl font-black text-white drop-shadow-md">
              {game.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 line-clamp-2">
              {game.description}
            </p>

            <div className="pt-2">
              <button
                onClick={handleLaunch}
                className="group inline-flex items-center gap-3 px-8 py-3.5 sm:px-10 sm:py-4 rounded-full bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-extrabold text-base sm:text-lg tracking-wider shadow-2xl shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all duration-200"
                aria-label={`Play ${game.title} directly in browser`}
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </div>
                PLAY NOW
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Loading State */}
      {isPlaying && isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#070a14] space-y-3">
          <div className="relative flex items-center justify-center w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-violet-500/20 border-t-cyan-400 animate-spin" />
            <Gamepad2 className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
          <p className="text-sm font-bold text-white tracking-wider animate-pulse">
            Loading game...
          </p>
          <p className="text-xs text-slate-500">Preparing browser runtime</p>
        </div>
      )}

      {/* 3. Error State */}
      {isPlaying && hasError && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#070a14] p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="max-w-md">
            <h3 className="text-lg font-bold text-white mb-1">Unable to load this game.</h3>
            <p className="text-xs text-slate-400">
              The game build could not be reached or initialization was interrupted.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRetry}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/30 transition-all"
            >
              Retry
            </button>
            <button
              onClick={() => setIsPlaying(false)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all"
            >
              Back to Game
            </button>
            <button
              onClick={onOpenReport}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 transition-all"
            >
              Report Problem
            </button>
          </div>
        </div>
      )}

      {/* 4. Active IFrame Player */}
      {isPlaying && (
        <div className="relative w-full h-full flex-1 bg-black">
          <iframe
            ref={iframeRef}
            src={game.gameUrl}
            title={game.title}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            allow="autoplay; fullscreen; gamepad; focus-without-user-activation *"
            className="w-full h-full border-none block"
            sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms"
          />

          {/* Pause Overlay if toggled */}
          {isPaused && (
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center space-y-3">
              <div className="p-4 rounded-full bg-violet-950/80 border border-violet-500/50 text-cyan-300">
                <Pause className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white tracking-widest">GAME PAUSED</h3>
              <button
                onClick={togglePause}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-bold text-xs"
              >
                RESUME
              </button>
            </div>
          )}
        </div>
      )}

      {/* 5. Bottom Controls Toolbar */}
      <div className="relative z-30 bg-[#0d1222] border-t border-slate-800/80 px-4 py-2.5 flex items-center justify-between text-xs text-slate-300">
        {/* Left Side: Game Status & Play/Pause */}
        <div className="flex items-center gap-2">
          {isPlaying ? (
            <button
              onClick={togglePause}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
              aria-label={isPaused ? 'Resume game' : 'Pause game'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
            </button>
          ) : (
            <button
              onClick={handleLaunch}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors"
              aria-label="Play game"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>PLAY</span>
            </button>
          )}

          {isPlaying && (
            <button
              onClick={handleReload}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              title="Restart Game"
              aria-label="Restart Game"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <span className="hidden sm:inline text-slate-500 text-[11px] ml-2">
            {isPlaying ? '• Game active in browser' : '• Ready to play'}
          </span>
        </div>

        {/* Right Side: Sound, Fullscreen, Share, Report */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-lg transition-colors ${
              soundOn ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-400 hover:bg-slate-800'
            }`}
            title={soundOn ? 'Mute Sound' : 'Enable Sound'}
            aria-label={soundOn ? 'Sound On' : 'Sound Muted'}
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-cyan-400" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Share */}
          <button
            onClick={onOpenShare}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Share Game"
            aria-label="Share Game"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Report */}
          <button
            onClick={onOpenReport}
            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
            title="Report Game"
            aria-label="Report Game"
          >
            <AlertTriangle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
