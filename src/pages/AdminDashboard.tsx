import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Gamepad2,
  TrendingUp,
  FileCode,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle,
  XCircle,
  Database,
  Lock,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  Server,
} from 'lucide-react';
import { Game, GameReport, GameSubmission } from '../types/game.ts';
import { storage } from '../services/storage.ts';
import { auth } from '../services/auth.ts';
import { AdminGameModal } from '../components/AdminGameModal.tsx';
import { formatPlayCount } from '../utils/scoring.ts';
import { playUiClick } from '../utils/sound.ts';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
  onSelectGame: (slug: string) => void;
  onRefreshAll: () => void;
}

type AdminTab = 'overview' | 'games' | 'submissions' | 'reports' | 'database';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate,
  onSelectGame,
  onRefreshAll,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [games, setGames] = useState<Game[]>(() => storage.getGames());
  const [submissions, setSubmissions] = useState<GameSubmission[]>(() => storage.getSubmissions());
  const [reports, setReports] = useState<GameReport[]>(() => storage.getReports());
  const [stats, setStats] = useState(() => storage.getOverviewStats());

  const [gameModalOpen, setGameModalOpen] = useState(false);
  const [gameToEdit, setGameToEdit] = useState<Game | null>(null);

  const currentUser = auth.getCurrentUser();
  const isAdmin = auth.isAdmin();

  const reloadData = () => {
    const updatedGames = storage.getGames();
    setGames(updatedGames);
    setSubmissions(storage.getSubmissions());
    setReports(storage.getReports());
    setStats(storage.getOverviewStats());
    onRefreshAll();
  };

  const handleTogglePublish = (id: string) => {
    playUiClick();
    storage.togglePublish(id);
    reloadData();
  };

  const handleToggleFeatured = (id: string) => {
    playUiClick();
    storage.toggleFeatured(id);
    reloadData();
  };

  const handleDeleteGame = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      playUiClick();
      storage.deleteGame(id);
      reloadData();
    }
  };

  const handleSubmissionAction = (id: string, status: 'approved' | 'rejected') => {
    playUiClick();
    storage.updateSubmissionStatus(id, status);
    reloadData();
  };

  const handleReportAction = (id: string, status: 'resolved' | 'investigating') => {
    playUiClick();
    storage.updateReportStatus(id, status);
    reloadData();
  };

  const handleResetCatalog = () => {
    if (window.confirm('Reset catalog to verified default seed games?')) {
      playUiClick();
      storage.resetToDefault();
      reloadData();
    }
  };

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-[#090d16] border border-amber-500/30 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-400 shadow-lg shadow-amber-950/50">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Admin Command Suite
              </h1>
              <span className="px-2.5 py-0.5 text-[10px] font-black rounded-full bg-amber-950 text-amber-300 border border-amber-500/50">
                AUTHORIZED
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Manage games catalog, review developer submissions, handle reports, and configure storage.
            </p>
          </div>
        </div>

        {/* Quick Access Switch / Auth notice */}
        <div className="flex items-center gap-2">
          {!isAdmin && (
            <button
              onClick={() => {
                auth.loginAsAdmin();
                reloadData();
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-lg shadow-amber-500/30"
            >
              Unlock Admin Privileges
            </button>
          )}

          <button
            onClick={handleResetCatalog}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Reset to default seed games"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Catalog
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        <button
          onClick={() => {
            playUiClick();
            setActiveTab('overview');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'bg-[#101422] text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> Overview
        </button>

        <button
          onClick={() => {
            playUiClick();
            setActiveTab('games');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'games'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'bg-[#101422] text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Gamepad2 className="w-4 h-4" /> Game Management ({games.length})
        </button>

        <button
          onClick={() => {
            playUiClick();
            setActiveTab('submissions');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'submissions'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'bg-[#101422] text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <FileCode className="w-4 h-4" /> Submissions Queue
          {stats.pendingGames > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-black">
              {stats.pendingGames}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            playUiClick();
            setActiveTab('reports');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'reports'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'bg-[#101422] text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" /> User Reports
          {stats.openReports > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-black">
              {stats.openReports}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            playUiClick();
            setActiveTab('database');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'database'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'bg-[#101422] text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Database className="w-4 h-4" /> Database Architecture
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-2xl bg-[#0f1424] border border-slate-800 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Games
              </span>
              <div className="text-3xl font-black text-white">{stats.totalGames}</div>
              <span className="text-[10px] text-cyan-400 font-medium">In master database</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0f1424] border border-slate-800 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Published
              </span>
              <div className="text-3xl font-black text-emerald-400">{stats.publishedGames}</div>
              <span className="text-[10px] text-emerald-500/80 font-medium">Publicly playable</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0f1424] border border-slate-800 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Pending Submissions
              </span>
              <div className="text-3xl font-black text-amber-400">{stats.pendingGames}</div>
              <span className="text-[10px] text-amber-500/80 font-medium">Awaiting review</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0f1424] border border-slate-800 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Plays
              </span>
              <div className="text-3xl font-black text-violet-400">
                {formatPlayCount(stats.totalPlays)}
              </div>
              <span className="text-[10px] text-violet-400/80 font-medium">All launches</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0f1424] border border-slate-800 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Open Reports
              </span>
              <div className="text-3xl font-black text-rose-400">{stats.openReports}</div>
              <span className="text-[10px] text-rose-400/80 font-medium">Needs attention</span>
            </div>
          </div>

          {/* Most Played Games */}
          <div className="bg-[#0f1424] border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-black text-lg text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" /> Most Played Games
            </h3>
            <div className="divide-y divide-slate-800">
              {stats.mostPlayedGames.map((game, idx) => (
                <div
                  key={game.id}
                  className="py-3 flex items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center font-black text-slate-500">#{idx + 1}</span>
                    <img
                      src={game.thumbnailUrl}
                      alt={game.title}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-white text-sm">{game.title}</h4>
                      <p className="text-slate-400">{game.category} • by {game.developer}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-black text-sm text-cyan-400">
                      {game.playCount.toLocaleString()} plays
                    </span>
                    <button
                      onClick={() => onSelectGame(game.slug)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GAME MANAGEMENT */}
      {activeTab === 'games' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-white">Game Catalog Management</h3>
              <p className="text-xs text-slate-400">
                Add, edit, feature, publish or delete game records.
              </p>
            </div>

            <button
              onClick={() => {
                playUiClick();
                setGameToEdit(null);
                setGameModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" /> Add New Game
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0f1424]">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#090d18] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Game</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Developer</th>
                  <th className="p-4">Plays</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">License</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {games.map((game) => (
                  <tr key={game.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={game.thumbnailUrl}
                        alt={game.title}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          {game.title}
                          {game.featured && (
                            <span className="px-1.5 py-0.2 text-[9px] font-black rounded bg-amber-950 text-amber-300 border border-amber-500/40">
                              FEATURED
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">/game/{game.slug}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold text-[11px]">
                        {game.category}
                      </span>
                    </td>

                    <td className="p-4 font-medium text-slate-200">{game.developer}</td>

                    <td className="p-4 font-mono text-cyan-400">{game.playCount.toLocaleString()}</td>

                    <td className="p-4 font-bold text-amber-400">⭐ {game.rating.toFixed(1)}</td>

                    <td className="p-4 text-slate-400 text-[11px]">{game.licenseType}</td>

                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          game.published
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {game.published ? 'Published' : 'Draft / Hidden'}
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-2">
                      {/* Toggle publish */}
                      <button
                        onClick={() => handleTogglePublish(game.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        title={game.published ? 'Unpublish Game' : 'Publish Game'}
                      >
                        {game.published ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4" />}
                      </button>

                      {/* Toggle featured */}
                      <button
                        onClick={() => handleToggleFeatured(game.id)}
                        className={`p-1.5 rounded-lg ${
                          game.featured
                            ? 'text-amber-400 hover:bg-amber-950/40'
                            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                        }`}
                        title={game.featured ? 'Remove from Featured Hero' : 'Feature on Hero'}
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => {
                          setGameToEdit(game);
                          setGameModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-cyan-400 hover:bg-cyan-950/40"
                        title="Edit Game"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteGame(game.id, game.title)}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40"
                        title="Delete Game"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SUBMISSIONS QUEUE */}
      {activeTab === 'submissions' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-black text-white">Developer Submissions Review</h3>
            <p className="text-xs text-slate-400">
              Review game builds and distribution licenses submitted by indie developers.
            </p>
          </div>

          {submissions.length === 0 ? (
            <div className="py-16 text-center bg-[#0f1424] border border-slate-800 rounded-3xl p-8 space-y-2">
              <p className="text-sm text-slate-300 font-semibold">No submissions in queue.</p>
              <p className="text-xs text-slate-500">Developer submissions will appear here for clearance.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-5 rounded-2xl bg-[#0f1424] border border-slate-800 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-violet-950 border border-violet-500/30 overflow-hidden shrink-0">
                        <img
                          src={sub.thumbnailUrl}
                          alt={sub.gameTitle}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-base text-white">{sub.gameTitle}</h4>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                              sub.status === 'pending'
                                ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                                : sub.status === 'approved'
                                ? 'bg-emerald-950 text-emerald-300'
                                : 'bg-rose-950 text-rose-300'
                            }`}
                          >
                            {sub.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          by <strong className="text-slate-200">{sub.developerName}</strong> ({sub.developerEmail}) • {sub.category}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    {sub.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSubmissionAction(sub.id, 'approved')}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all"
                        >
                          <CheckCircle className="w-4 h-4" /> Approve & Publish
                        </button>
                        <button
                          onClick={() => handleSubmissionAction(sub.id, 'rejected')}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-bold text-xs transition-all"
                        >
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-[#0a0d18] p-3 rounded-xl border border-slate-800">
                    {sub.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#090d18] p-3 rounded-xl border border-slate-800/80">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Game URL</span>
                      <a
                        href={sub.gameUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:underline flex items-center gap-1 truncate"
                      >
                        {sub.gameUrl} <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">License & Rights</span>
                      <span className="text-slate-200">{sub.licenseType}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Permission</span>
                      <span className="text-slate-300 truncate block">{sub.distributionPermission}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: USER REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-black text-white">User Problem Reports</h3>
            <p className="text-xs text-slate-400">
              Broken controls, loading failures, copyright questions, or content flags.
            </p>
          </div>

          {reports.length === 0 ? (
            <div className="py-16 text-center bg-[#0f1424] border border-slate-800 rounded-3xl p-8 space-y-2">
              <p className="text-sm text-slate-300 font-semibold">No reports filed.</p>
              <p className="text-xs text-slate-500">Games are functioning smoothly without flagged problems.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-5 rounded-2xl bg-[#0f1424] border border-slate-800 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-400">
                        <AlertTriangle className="w-4 h-4" />
                      </span>
                      <div>
                        <h4 className="font-bold text-white text-sm">
                          {rep.gameTitle} • <span className="text-rose-400">{rep.reason}</span>
                        </h4>
                        <span className="text-[11px] text-slate-500">
                          Reported on {rep.createdAt.split('T')[0]} {rep.reporterEmail ? `by ${rep.reporterEmail}` : ''}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rep.status === 'open'
                            ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                            : rep.status === 'investigating'
                            ? 'bg-amber-950 text-amber-300'
                            : 'bg-emerald-950 text-emerald-300'
                        }`}
                      >
                        {rep.status.toUpperCase()}
                      </span>
                      {rep.status !== 'resolved' && (
                        <button
                          onClick={() => handleReportAction(rep.id, 'resolved')}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 bg-[#0a0d18] p-3 rounded-xl border border-slate-800">
                    {rep.details}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: DATABASE ARCHITECTURE */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-black text-white">Database & Persistence Architecture</h3>
            <p className="text-xs text-slate-400">
              UNIPLAYZZ data model, Firestore schema compatibility, and storage runtime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Storage Mode */}
            <div className="p-6 rounded-2xl bg-[#0f1424] border border-cyan-500/30 space-y-4">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Database className="w-5 h-5" /> Active Persistence Mode: LocalStorage Repository
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Because the interactive Firebase setup was declined or unconfigured, the application is actively using the <strong>Zero-Latency Local Storage Persistence Adapter</strong>.
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
                <li>Instant offline persistence for added/edited games</li>
                <li>Live play counter tracking & rating calculations</li>
                <li>Developer submission queue and admin approval cycle</li>
                <li>Personalized favorites & recent game history</li>
              </ul>
              <div className="pt-2">
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  Status: 100% Operational
                </span>
              </div>
            </div>

            {/* Firestore Schema Mapping */}
            <div className="p-6 rounded-2xl bg-[#0f1424] border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Server className="w-5 h-5" /> Firestore Collection Specification
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                The storage repository is fully normalized to mirror the Firestore collection architecture:
              </p>
              <div className="font-mono text-[11px] bg-[#090d18] p-3 rounded-xl border border-slate-800 text-slate-300 space-y-1">
                <div>• /games/{'{gameId}'} (Catalog documents)</div>
                <div>• /submissions/{'{subId}'} (Pending developer submissions)</div>
                <div>• /reports/{'{repId}'} (User flags)</div>
                <div>• /ratings/{'{gameId_userId}'} (1-5 star user reviews)</div>
                <div>• /leaderboards/{'{gameId}'}/scores (Verified score logs)</div>
                <div>• /users/{'{userId}'} (Profile, favorites, history)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Game Modal */}
      <AdminGameModal
        gameToEdit={gameToEdit}
        isOpen={gameModalOpen}
        onClose={() => setGameModalOpen(false)}
        onSaved={reloadData}
      />
    </div>
  );
};
