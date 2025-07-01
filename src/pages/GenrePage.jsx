import { useParams, Link } from 'react-router-dom';
import { animeData } from '../data/dummyData';
import AnimeCard from '../components/AnimeCard';
import GenreBadge from '../components/GenreBadge';

const GenrePage = () => {
  const { genre } = useParams();
  const decodedGenre = decodeURIComponent(genre);
  
  // Filter anime by genre
  const genreAnime = animeData.filter(anime =>
    anime.genre.includes(decodedGenre)
  );

  // Get genre statistics
  const completedCount = genreAnime.filter(anime => anime.status === 'complete').length;
  const ongoingCount = genreAnime.filter(anime => anime.status === 'ongoing').length;
  const avgScore = genreAnime.length > 0 
    ? (genreAnime.reduce((sum, anime) => sum + anime.score, 0) / genreAnime.length).toFixed(1)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <i className="ri-arrow-left-line mr-1"></i>
          Back to Home
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <GenreBadge genre={decodedGenre} clickable={false} size="normal" className="text-base px-4 py-2" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {decodedGenre} Anime
          </h1>
        </div>
        <p className="text-gray-600">
          Discover {genreAnime.length} amazing {decodedGenre.toLowerCase()} anime in your collection
        </p>
      </div>

      {/* Stats */}
      {genreAnime.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="ri-play-circle-line text-blue-600 text-xl"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-xl font-bold text-gray-900">{genreAnime.length}</p>
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
                <p className="text-xl font-bold text-gray-900">{completedCount}</p>
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
                <p className="text-xl font-bold text-gray-900">{ongoingCount}</p>
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
                <p className="text-xl font-bold text-gray-900">{avgScore}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Anime Grid */}
      {genreAnime.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {genreAnime.map(anime => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-emotion-sad-line text-gray-400 text-2xl"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No {decodedGenre} anime found</h3>
          <p className="text-gray-500 mb-4">
            You don't have any {decodedGenre.toLowerCase()} anime in your collection yet.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Explore All Anime
          </Link>
        </div>
      )}
    </div>
  );
};

export default GenrePage;