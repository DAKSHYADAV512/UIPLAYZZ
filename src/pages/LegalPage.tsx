import React from 'react';
import { ShieldCheck, FileText, ChevronLeft, Scale, AlertCircle, HeartHandshake } from 'lucide-react';
import { playUiClick } from '../utils/sound.ts';

interface LegalPageProps {
  onNavigate: (path: string) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Back button */}
      <div>
        <button
          onClick={() => {
            playUiClick();
            onNavigate('/');
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0f1424] hover:bg-[#151c32] border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </button>
      </div>

      {/* Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-violet-950/40 via-cyan-950/30 to-[#090d16] border border-violet-500/30 shadow-2xl space-y-3">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <Scale className="w-4 h-4" /> Intellectual Property & Distribution Rights
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Licensing, Rights & Legal Policy
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
          UNIPLAYZZ is built on strict respect for game developers, artists, and creators. We maintain a zero-tolerance policy against unauthorized redistribution of commercial copyrighted games.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed">
        {/* Pillar 1 */}
        <section className="bg-[#0f1424] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-white">
              1. Permitted Game Categories on UNIPLAYZZ
            </h2>
          </div>
          <p>
            Every browser game featured on UNIPLAYZZ belongs strictly to one of three authorized categories:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-[#090d18] border border-slate-800 space-y-2">
              <span className="text-xs font-black text-violet-400 uppercase tracking-wider block">
                Platform Originals
              </span>
              <p className="text-xs text-slate-400">
                Games developed specifically by or for the UNIPLAYZZ platform team under our 1P Original License.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#090d18] border border-slate-800 space-y-2">
              <span className="text-xs font-black text-cyan-400 uppercase tracking-wider block">
                Authorized Indie Devs
              </span>
              <p className="text-xs text-slate-400">
                Games created by independent game developers who have explicitly granted UNIPLAYZZ digital browser distribution clearance.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#090d18] border border-slate-800 space-y-2">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wider block">
                Permissive Open Source
              </span>
              <p className="text-xs text-slate-400">
                Games released under permissive open-source licenses (MIT, Apache 2.0, CC-BY) whose terms explicitly permit redistribution.
              </p>
            </div>
          </div>
        </section>

        {/* Pillar 2 */}
        <section className="bg-[#0f1424] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-white">
              2. Distribution Permission vs. "Free to Play"
            </h2>
          </div>
          <p>
            A critical legal principle enforced on UNIPLAYZZ is that <strong>a game being free to play on the web does NOT automatically mean anyone can host or redistribute it</strong>.
          </p>
          <p className="text-slate-400">
            Many flash, HTML5, or WebGL games found across the internet are copyrighted proprietary works. Distributing them without an explicit license or written authorization from the copyright holder is copyright infringement. UNIPLAYZZ requires affirmative verification before any title is published.
          </p>
        </section>

        {/* Pillar 3 */}
        <section id="dmca" className="bg-[#0f1424] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-400">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-white">
              3. Copyright Notice & DMCA Takedown Procedure
            </h2>
          </div>
          <p>
            If you are a copyright owner or an agent thereof and believe that any game or content on UNIPLAYZZ infringes upon your copyright, you may use the in-app "Report Game" feature or submit a formal notice to our administration:
          </p>
          <div className="p-4 rounded-2xl bg-[#090d18] border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
            <div>Email: dmca@uniplayzz.com / admin@uniplayzz.com</div>
            <div>Subject: DMCA Notice - [Game Title]</div>
            <div>Details: Link to the game, proof of ownership, contact details.</div>
          </div>
          <p className="text-xs text-slate-400">
            Our administrators review flagged copyright reports immediately and will unpublish or remove infringing works within 24 hours of notification.
          </p>
        </section>
      </div>
    </div>
  );
};
