import React, { useState, useMemo } from 'react';
import type { Booklet, BookletCategory } from '../types';
import { BookOpen, Search, Sparkles, GraduationCap, Layers } from 'lucide-react';

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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-amber-400 mb-4 tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Curriculum Library</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
          Master Modern AI with Visual Clarity.
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
          Select any course module below. Every booklet is delivered in ultra-optimized WebP
          with smart prefetching, fluid navigation, and zero distractions.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        {/* Category Tabs */}
        <div className="flex items-center space-x-1 p-1 bg-zinc-900/90 border border-zinc-800 rounded-xl w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>All Modules ({booklets.length})</span>
          </button>
          <button
            onClick={() => setSelectedCategory('student')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              selectedCategory === 'student'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Students AI ({studentCount})</span>
          </button>
          <button
            onClick={() => setSelectedCategory('teacher')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              selectedCategory === 'teacher'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Educators Toolkit ({teacherCount})</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search booklets..."
            className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
          />
        </div>
      </div>

      {/* Grid of Booklet Cards */}
      {filteredBooklets.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
          <BookOpen className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white mb-1">No Booklets Found</h3>
          <p className="text-zinc-500 text-sm">
            Try adjusting your search query or switching categories.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooklets.map((booklet) => {
            // Determine cover image URL
            const coverUrl = booklet.customCoverUrl 
              ? booklet.customCoverUrl 
              : `${booklet.cdnBaseUrl}${booklet.coverPath}`;

            const isStudent = booklet.category === 'student';

            return (
              <div
                key={booklet.id}
                onClick={() => onSelectBooklet(booklet)}
                className="group relative bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5 flex flex-col"
              >
                {/* Cover Image Container */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-950">
                  <img
                    src={coverUrl}
                    alt={booklet.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback if CDN cover not yet online
                      (e.target as HTMLImageElement).src =
                        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"><rect fill="%2318181b" width="300" height="400"/><text fill="%23d4af37" font-size="20" font-family="sans-serif" x="50%" y="50%" text-anchor="middle">ŪRDHV ASCENS</text></svg>';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider backdrop-blur-md ${
                        isStudent
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      {isStudent ? 'Student' : 'Educator'}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono text-zinc-400 bg-zinc-900/80 backdrop-blur-md border border-zinc-800">
                      v{booklet.version}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3">
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold text-white bg-zinc-950/80 backdrop-blur-md border border-zinc-800 flex items-center space-x-1">
                      <BookOpen className="w-3 h-3 text-amber-400" />
                      <span>{booklet.totalPages} Pages</span>
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1 mb-1">
                      {booklet.title}
                    </h3>
                    <p className="text-zinc-400 text-xs line-clamp-2 mb-4 leading-relaxed">
                      {booklet.shortDescription}
                    </p>
                  </div>

                  <button
                    className="w-full mt-auto py-2 px-3 rounded-xl bg-zinc-800 group-hover:bg-amber-500 text-zinc-200 group-hover:text-black text-xs font-semibold transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Read Booklet</span>
                    <BookOpen className="w-3.5 h-3.5" />
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
