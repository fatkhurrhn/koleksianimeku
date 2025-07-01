import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { animeData, genres } from '../data/dummyData';
import AnimeCard from '../components/AnimeCard';
import GenreBadge from '../components/GenreBadge';

const Home = () => {
  const [searchParams] = useSearchParams();
  const [selectedGenre, setSelectedGenre] = useState('All');
  const searchTerm = searchParams.get('search') || '';

  // Filter anime based on search and genre
  const filteredAnime = useMemo(() => {
    let filtered = animeData;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(anime =>
        anime.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        anime.genre.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by selected genre
    if (selectedGenre !== 'All') {
      filtered = filtered.filter(anime =>
        anime.genre.includes(selectedGenre)
      );
    }

    return filtered;
  }, [searchTerm, selectedGenre]);

  // Reset genre filter when searching
  useEffect(() => {
    if (searchTerm) {
      setSelectedGenre('All');
    }
  }, [searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {searchTerm ? `Search results for "${searchTerm}"` : 'My Anime Collection'}
        </h1>
        <p className="text-gray-600">
          {searchTerm 
            ? `Found ${filteredAnime.length} anime` 
            : `Track and discover your favorite anime • ${animeData.length} total anime`
          }
        </p>
      </div>

      {/* Genre Filter */}
      {!searchTerm && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter by Genre</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedGenre('All')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedGenre === 'All'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Genres
            </button>
            {genres.map(genre => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedGenre === genre
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {!searchTerm && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="ri-play-circle-line text-blue-600 text-xl"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Anime</p>
                <p className="text-xl font-bold text-gray-900">{animeData.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-checkbox-circle-line text-green-600 text-xl"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-xl font-bold text-gray-900">
                  {animeData.filter(anime => anime.status === 'complete').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="ri-time-line text-orange-600 text-xl"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Ongoing</p>
                <p className="text-xl font-bold text-gray-900">
                  {animeData.filter(anime => anime.status === 'ongoing').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <i className="ri-star-fill text-yellow-600 text-xl"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Avg Score</p>
                <p className="text-xl font-bold text-gray-900">
                  {(animeData.reduce((sum, anime) => sum + anime.score, 0) / animeData.length).toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Anime Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {filteredAnime.map(anime => (
          <AnimeCard key={anime.id} anime={anime} />
        ))}
      </div>

      {/* No Results */}
      {filteredAnime.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-search-line text-gray-400 text-2xl"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No anime found</h3>
          <p className="text-gray-500">
            {searchTerm 
              ? `No anime found for "${searchTerm}". Try a different search term.`
              : `No anime found for the selected genre.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;