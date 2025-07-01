import { useParams, Link } from 'react-router-dom';
import { animeData } from '../data/dummyData';
import GenreBadge from '../components/GenreBadge';
import AnimeCard from '../components/AnimeCard';

const AnimeDetail = () => {
  const { id } = useParams();
  const anime = animeData.find(a => a.id === parseInt(id));

  if (!anime) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Anime not found</h1>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Get recommendations (top 3 highest scored anime excluding current)
  const recommendations = animeData
    .filter(a => a.id !== anime.id)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const statusConfig = {
    complete: {
      color: 'bg-green-100 text-green-800',
      icon: 'ri-checkbox-circle-line',
      text: 'Complete'
    },
    ongoing: {
      color: 'bg-blue-100 text-blue-800',
      icon: 'ri-play-line',
      text: 'Ongoing'
    }
  };

  const status = statusConfig[anime.status] || statusConfig.ongoing;

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

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="md:flex">
          {/* Thumbnail */}
          <div className="md:w-1/3 lg:w-1/4">
            <img
              src={anime.thumbnail}
              alt={anime.title}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex-1 p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-0">
                {anime.title}
              </h1>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                  <i className={`${status.icon} mr-1`}></i>
                  {status.text}
                </span>
                {anime.score && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    <i className="ri-star-fill mr-1"></i>
                    {anime.score}/10
                  </span>
                )}
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {anime.studio && (
                <div className="flex items-center text-gray-600">
                  <i className="ri-building-line mr-2 text-gray-400"></i>
                  <span className="text-sm">Studio: </span>
                  <span className="text-sm font-medium ml-1">{anime.studio}</span>
                </div>
              )}
              
              {anime.year && (
                <div className="flex items-center text-gray-600">
                  <i className="ri-calendar-line mr-2 text-gray-400"></i>
                  <span className="text-sm">Year: </span>
                  <span className="text-sm font-medium ml-1">{anime.year}</span>
                </div>
              )}
              
              {anime.episodes && (
                <div className="flex items-center text-gray-600">
                  <i className="ri-play-list-line mr-2 text-gray-400"></i>
                  <span className="text-sm">Episodes: </span>
                  <span className="text-sm font-medium ml-1">{anime.episodes}</span>
                </div>
              )}

              {anime.watchLink && (
                <div className="flex items-center">
                  <a
                    href={anime.watchLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <i className="ri-external-link-line mr-2"></i>
                    Watch Now
                  </a>
                </div>
              )}
            </div>

            {/* Genres */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {anime.genre?.map(genre => (
                  <GenreBadge key={genre} genre={genre} />
                ))}
              </div>
            </div>

            {/* Description */}
            {anime.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{anime.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recommended for You</h2>
            <p className="text-sm text-gray-500">Top rated anime</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {recommendations.map(anime => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimeDetail;