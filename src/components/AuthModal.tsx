import React, { useState } from 'react';
import {
  X,
  User,
  ShieldCheck,
  Mail,
  LogIn,
  LogOut,
  Sparkles,
  Gamepad,
  Heart,
  Clock,
} from 'lucide-react';
import { auth } from '../services/auth.ts';
import { playUiClick } from '../utils/sound.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const currentUser = auth.getCurrentUser();

  if (!isOpen) return null;

  const handleAdminLogin = () => {
    playUiClick();
    auth.loginAsAdmin();
    onClose();
  };

  const handlePlayerLogin = () => {
    playUiClick();
    auth.loginAsPlayer('NeonPilot');
    onClose();
  };

  const handleGoogleLogin = () => {
    playUiClick();
    auth.loginWithGoogle();
    onClose();
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    playUiClick();
    auth.loginWithEmail(email, name);
    onClose();
  };

  const handleLogout = () => {
    playUiClick();
    auth.logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#0f1424] border border-violet-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/80">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/50 hover:bg-slate-800"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {currentUser ? (
          /* Profile Overview */
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.displayName}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-violet-400"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-violet-950 flex items-center justify-center text-violet-300">
                  <User className="w-8 h-8" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-white">{currentUser.displayName}</h3>
                  {currentUser.isAdmin && (
                    <span className="px-2 py-0.5 text-[10px] font-black rounded bg-amber-950 text-amber-300 border border-amber-500/40">
                      ADMIN
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">{currentUser.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <button
                onClick={() => {
                  onNavigate('/favorites');
                  onClose();
                }}
                className="p-3 bg-[#13192c] hover:bg-[#1a223c] border border-slate-700/60 rounded-xl text-left transition-colors"
              >
                <div className="flex items-center gap-1.5 text-rose-400 font-bold mb-1">
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" /> Favorites
                </div>
                <div className="text-lg font-black text-white">
                  {currentUser.favorites?.length || 0} Saved
                </div>
              </button>

              <div className="p-3 bg-[#13192c] border border-slate-700/60 rounded-xl text-left">
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1">
                  <Clock className="w-4 h-4" /> Recent
                </div>
                <div className="text-lg font-black text-white">
                  {currentUser.recentlyPlayed?.length || 0} Played
                </div>
              </div>
            </div>

            {currentUser.isAdmin && (
              <button
                onClick={() => {
                  onNavigate('/admin');
                  onClose();
                }}
                className="w-full py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <ShieldCheck className="w-4 h-4" /> Open Admin Portal
              </button>
            )}

            <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-semibold"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* Sign In Options */
          <div className="space-y-5">
            <div className="text-center space-y-1">
              <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-400 text-white mb-2 shadow-lg shadow-purple-950">
                <Gamepad className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-white">Join UNIPLAYZZ</h3>
              <p className="text-xs text-slate-400">
                Save your favorites, rate games, and post verified scores!
              </p>
            </div>

            {/* Quick Demo Logins for immediate review */}
            <div className="p-3.5 bg-violet-950/30 border border-violet-500/30 rounded-2xl space-y-2">
              <span className="text-[11px] font-bold text-violet-300 uppercase tracking-wider block">
                Instant Review Logins:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleAdminLogin}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 font-bold text-xs transition-all"
                >
                  <ShieldCheck className="w-4 h-4" /> Admin Login
                </button>
                <button
                  onClick={handlePlayerLogin}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 font-bold text-xs transition-all"
                >
                  <User className="w-4 h-4" /> Player Login
                </button>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Continue with Google
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-[#0f1424] px-3 text-[10px] text-slate-500 uppercase tracking-wider absolute">
                or with email
              </span>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Display Name</label>
                <input
                  type="text"
                  placeholder="e.g. StarLord"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0a0d18] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0a0d18] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-violet-600/30 hover:opacity-90 transition-opacity"
              >
                Sign In / Register
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
