import React, { useState, useMemo } from 'react';
import type { Booklet, BookletCategory } from '../types';
import { defaultDocumentProvider } from '../services/documentProvider';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  GraduationCap, 
  Layers, 
  ArrowRight, 
  CheckCircle,
  FileText,
  X
} from 'lucide-react';

interface BookletLibraryProps {
  booklets: Booklet[];
  onSelectBooklet: (booklet: Booklet) => void;
}

export const BookletLibrary: React.FC<BookletLibraryProps> = ({
  booklets,
  onSelectBooklet
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | BookletCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooklets = useMemo(() => {
    return booklets.filter((b) => {
      const matchesCategory = selectedCategory === 'all' || b.category === selectedCategory;
      const matchesSearch =
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [booklets, selectedCategory, searchQuery]);

  const studentCount = booklets.filter(b => b.category === 'student').length;
  const teacherCount = booklets.filter(b => b.category === 'teacher').length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 mb-5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-bold tracking-[0.2em] uppercase text-xs">
            OFFICIAL CURRICULUM ARCHIVE
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase mb-5">
          VISUAL AI <span className="text-emerald-400">CURRICULUM</span>
        </h1>

        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-8 font-normal">
          Beautifully illustrated, high-resolution learning modules for students and educators. 
          Free, open-access curriculum designed for focused, self-paced study.
        </p>

        {/* Feature Specs Badges (Non-pill, rounded-lg) */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-850 text-zinc-300">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold">12 Interactive Modules</span>
          </div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-850 text-zinc-300">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold">100% Free Open Access</span>
          </div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-850 text-zinc-300">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold">Instant High-Resolution Reading</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls Toolbar */}
      <div className="p-2 sm:p-2.5 bg-zinc-950 border border-zinc-850 rounded-2xl mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Tabs (Strictly rounded-lg, non-pill) */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Modules ({booklets.length})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('student')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${
              selectedCategory === 'student'
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Students AI ({studentCount})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('teacher')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${
              selectedCategory === 'teacher'
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Teachers AI ({teacherCount})</span>
          </button>
        </div>

        {/* Search Input Box */}
        <div className="relative flex-1 max-w-full md:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search modules, concepts..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-8 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Showing count indicator */}
      <div className="flex items-center justify-between text-xs text-zinc-500 mb-6 px-1 font-mono">
        <span>Showing {filteredBooklets.length} of {booklets.length} curriculum modules</span>
        {searchQuery && (
          <span className="text-emerald-400">Filtered by: "{searchQuery}"</span>
        )}
      </div>

      {/* Grid of Booklet Cards */}
      {filteredBooklets.length === 0 ? (
        <div className="text-center py-20 bg-zinc-950 rounded-2xl border border-zinc-850">
          <BookOpen className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white uppercase tracking-wider mb-1">
            No Modules Match Query
          </h3>
          <p className="text-zinc-500 text-xs mb-4">
            Try adjusting your search terms or clearing the category filter.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-emerald-300 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-6">
          {filteredBooklets.map((booklet) => {
            const coverUrl = defaultDocumentProvider.getCoverUrl(booklet);

            const isStudent = booklet.category === 'student';

            return (
              <div
                key={booklet.id}
                onClick={() => onSelectBooklet(booklet)}
                className="group relative bg-zinc-950 border border-zinc-850 hover:border-emerald-500/50 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between shadow-lg"
              >
                {/* Cover Image Frame */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-900 border-b border-zinc-850">
                  <img
                    src={coverUrl}
                    alt={booklet.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"><rect fill="%230a0a0c" width="300" height="400"/><text fill="%2300ff66" font-size="18" font-family="sans-serif" font-weight="bold" x="50%" y="50%" text-anchor="middle">ŪRDHV ASCENS</text></svg>';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-70" />

                  {/* Badges Overlay */}
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex items-center gap-1">
                    <span className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded sm:rounded-lg text-[8px] sm:text-[10px] font-bold uppercase tracking-wider bg-black text-emerald-400 border border-emerald-500/40">
                      {isStudent ? 'Students AI' : 'Teachers AI'}
                    </span>
                  </div>

                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                    <span className="px-1.5 py-0.5 rounded sm:rounded-lg text-[8px] sm:text-[10px] font-mono text-emerald-400 bg-black border border-zinc-800">
                      v{booklet.version}
                    </span>
                  </div>

                  <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3">
                    <span className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded sm:rounded-lg text-[9px] sm:text-[11px] font-semibold text-emerald-400 bg-black border border-zinc-800 flex items-center space-x-1 sm:space-x-1.5">
                      <FileText className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400" />
                      <span className="text-emerald-400">{booklet.totalPages} Pgs</span>
                    </span>
                  </div>
                </div>

                {/* Card Info Body */}
                <div className="p-2.5 sm:p-5 flex-1 flex flex-col justify-between">
                  <div className="mb-2 sm:mb-4">
                    <h3 className="text-xs sm:text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1 mb-1 sm:mb-1.5">
                      {booklet.title}
                    </h3>
                    <p className="text-zinc-400 text-[10px] sm:text-xs line-clamp-2 leading-tight sm:leading-relaxed">
                      {booklet.shortDescription}
                    </p>
                  </div>

                  {/* Read Booklet Action Button (Non-pill, rounded-lg) */}
                  <button
                    className="w-full py-1.5 sm:py-2.5 px-2 sm:px-4 rounded-md sm:rounded-lg bg-zinc-900 group-hover:bg-emerald-400 text-zinc-300 group-hover:text-black font-bold text-[10px] sm:text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-1 sm:space-x-2"
                  >
                    <span>Read Module</span>
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
