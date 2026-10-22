import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { DeveloperSubmitModal } from './components/DeveloperSubmitModal.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { GameDetailPage } from './pages/GameDetailPage.tsx';
import { CategoryPage } from './pages/CategoryPage.tsx';
import { FavoritesPage } from './pages/FavoritesPage.tsx';
import { AdminDashboard } from './pages/AdminDashboard.tsx';
import { LegalPage } from './pages/LegalPage.tsx';
import { Game } from './types/game.ts';
import { storage } from './services/storage.ts';
import { auth } from './services/auth.ts';

export default function App() {
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const [games, setGames] = useState<Game[]>(() => storage.getGames());
  const [favorites, setFavorites] = useState<string[]>(() => {
    const user = auth.getCurrentUser();
    return storage.getFavorites(user?.id || 'guest');
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);

  // Sync with browser navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Listen to auth state changes for favorites
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      const favs = storage.getFavorites(user?.id || 'guest');
      setFavorites(favs);
    });
    return unsubscribe;
  }, []);

  const navigateTo = useCallback((path: string) => {
    if (path.startsWith('/#')) {
      // Anchor link
      setCurrentPath('/');
      window.history.pushState({}, '', '/');
      setTimeout(() => {
        const id = path.substring(2);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }

    setCurrentPath(path);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleToggleFavorite = (gameId: string) => {
    const user = auth.getCurrentUser();
    const userId = user?.id || 'guest';
    storage.toggleFavorite(userId, gameId);
    setFavorites(storage.getFavorites(userId));
    if (user) {
      auth.toggleFavorite(gameId);
    }
  };

  const refreshAllGames = () => {
    setGames(storage.getGames());
  };

  // Route parsing
  const renderRoute = () => {
    // 1. Individual Game Page: /game/:slug
    if (currentPath.startsWith('/game/')) {
      const slug = currentPath.replace('/game/', '').split('/')[0];
      return (
        <GameDetailPage
          slug={slug}
          onNavigate={navigateTo}
          onSelectGame={(newSlug) => navigateTo(`/game/${newSlug}`)}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />
      );
    }

    // 2. Category Page: /games/:category
    if (currentPath.startsWith('/games/') && currentPath !== '/games/') {
      const categorySlug = currentPath.replace('/games/', '').split('/')[0];
      return (
        <CategoryPage
          categorySlug={categorySlug}
          games={games}
          onNavigate={navigateTo}
          onSelectGame={(slug) => navigateTo(`/game/${slug}`)}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />
      );
    }

    // 3. Favorites Page: /favorites
    if (currentPath === '/favorites') {
      return (
        <FavoritesPage
          games={games}
          favorites={favorites}
          onNavigate={navigateTo}
          onSelectGame={(slug) => navigateTo(`/game/${slug}`)}
          onToggleFavorite={handleToggleFavorite}
        />
      );
    }

    // 4. Admin Dashboard: /admin
    if (currentPath === '/admin') {
      return (
        <AdminDashboard
          onNavigate={navigateTo}
          onSelectGame={(slug) => navigateTo(`/game/${slug}`)}
          onRefreshAll={refreshAllGames}
        />
      );
    }

    // 5. Legal Page: /legal
    if (currentPath.startsWith('/legal')) {
      return <LegalPage onNavigate={navigateTo} />;
    }

    // 6. Default: All Games (/games) or Home (/)
    return (
      <HomePage
        games={games}
        onSelectGame={(slug) => navigateTo(`/game/${slug}`)}
        onSelectCategory={(cat) => navigateTo(`/games/${cat}`)}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Global Header */}
      <Header
        currentPath={currentPath}
        onNavigate={navigateTo}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenSubmit={() => setSubmitModalOpen(true)}
        favoritesCount={favorites.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
        {renderRoute()}
      </main>

      {/* Global Footer */}
      <Footer
        onNavigate={navigateTo}
        onOpenSubmit={() => setSubmitModalOpen(true)}
      />

      {/* Global Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onNavigate={navigateTo}
      />

      <DeveloperSubmitModal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        onSubmitted={refreshAllGames}
      />
    </div>
  );
}
