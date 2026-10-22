import React from 'react';
import { Gamepad2, Shield, Heart, FileText, ExternalLink, Code } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
  onOpenSubmit: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenSubmit }) => {
  return (
    <footer className="bg-[#05070e] border-t border-purple-500/20 text-slate-400 mt-20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 p-[1.5px]">
                <div className="w-full h-full bg-[#0d121f] rounded-[10px] flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <span className="font-black text-xl tracking-wider text-white">
                UNIPLAYZZ
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Play. Discover. Create. A next-generation browser gaming platform for verified original, licensed, and open-source games.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-lg w-fit">
              <Shield className="w-3.5 h-3.5" /> 100% Free & Legal Games
            </div>
          </div>

          {/* Quick Explore */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('/')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Featured & Trending
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/games')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  All Games Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/games/arcade')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Arcade Games
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/games/action')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Action Games
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/games/puzzle')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Puzzle Games
                </button>
              </li>
            </ul>
          </div>

          {/* Developers & Community */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Developers
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenSubmit}
                  className="hover:text-violet-400 transition-colors text-violet-300 font-medium"
                >
                  Submit Your Game
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/admin')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Admin & Review Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/legal')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Open Source & Licensing Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/legal#distribution')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Distribution Permission Terms
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / Rights */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Legal & Compliance
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              UNIPLAYZZ respects intellectual property. Every title is either an official platform original, explicitly authorized by developers, or compliant with permissive open-source licenses (MIT, CC-BY, Apache).
            </p>
            <button
              onClick={() => onNavigate('/legal')}
              className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 underline"
            >
              <FileText className="w-3.5 h-3.5" /> Full Licensing Statement
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} UNIPLAYZZ. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('/legal')} className="hover:text-slate-300">
              Licensing Policy
            </button>
            <button onClick={() => onNavigate('/legal#dmca')} className="hover:text-slate-300">
              DMCA & Copyright Notice
            </button>
            <button onClick={() => onNavigate('/favorites')} className="hover:text-slate-300">
              Favorites
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
