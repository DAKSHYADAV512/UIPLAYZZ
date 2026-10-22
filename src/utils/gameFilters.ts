import type { Game, GameCategory } from '../types/game.ts';

export type SortOption = 'popular' | 'newest' | 'rating' | 'title';

export interface FilterOptions {
  query?: string;
  category?: GameCategory | 'All';
  sortBy?: SortOption;
  onlyPublished?: boolean;
  featuredOnly?: boolean;
}

export function filterGames(games: Game[], options: FilterOptions = {}): Game[] {
  const {
    query = '',
    category = 'All',
    sortBy = 'popular',
    onlyPublished = true,
    featuredOnly = false,
  } = options;

  const normalizedQuery = query.trim().toLowerCase();

  return games
    .filter((game) => {
      // Visibility check
      if (onlyPublished && !game.published) return false;
      if (featuredOnly && !game.featured) return false;

      // Category check
      if (category !== 'All' && game.category !== category) return false;

      // Search query check (title, developer, tags, category, description)
      if (normalizedQuery) {
        const matchesTitle = game.title.toLowerCase().includes(normalizedQuery);
        const matchesDev = game.developer.toLowerCase().includes(normalizedQuery);
        const matchesCat = game.category.toLowerCase().includes(normalizedQuery);
        const matchesTags = game.tags.some((t) => t.toLowerCase().includes(normalizedQuery));
        const matchesDesc = game.description.toLowerCase().includes(normalizedQuery);

        if (!matchesTitle && !matchesDev && !matchesCat && !matchesTags && !matchesDesc) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.playCount - a.playCount;
        case 'newest':
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        case 'rating':
          return b.rating - a.rating;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
}

export function paginateGames(games: Game[], page: number, pageSize: number): {
  items: Game[];
  total: number;
  totalPages: number;
  currentPage: number;
} {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const total = games.length;
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));
  const startIndex = (safePage - 1) * safePageSize;
  const items = games.slice(startIndex, startIndex + safePageSize);

  return {
    items,
    total,
    totalPages,
    currentPage: Math.min(safePage, totalPages),
  };
}

export function getTrendingGames(games: Game[], limit = 6): Game[] {
  // Trending balances high play count and recent updates/ratings
  return filterGames(games, { onlyPublished: true, sortBy: 'popular' }).slice(0, limit);
}

export function getNewGames(games: Game[], limit = 6): Game[] {
  return filterGames(games, { onlyPublished: true, sortBy: 'newest' }).slice(0, limit);
}

export function getPopularGames(games: Game[], limit = 6): Game[] {
  return filterGames(games, { onlyPublished: true, sortBy: 'popular' }).slice(0, limit);
}

export function getFeaturedGame(games: Game[]): Game | undefined {
  const published = games.filter((g) => g.published);
  return published.find((g) => g.featured) || published[0];
}
