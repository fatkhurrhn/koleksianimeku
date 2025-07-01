import { Link } from 'react-router-dom';
import GenreBadge from './GenreBadge';

const AnimeCard = ({ anime }) => {
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
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
      <Link to={`/anime/${anime.id}`}>
        <div className="relative">
          <img
            src={anime.thumbnail}
            alt={anime.title}
            className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
              <i className={`${status.icon} mr-1`}></i>
              {status.text}
            </span>
          </div>
          {anime.score && (
            <div className="absolute top-2 left-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <i className="ri-star-fill mr-1"></i>
                {anime.score}
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/anime/${anime.id}`}>
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {anime.title}
          </h3>
        </Link>

        <div className="space-y-2">
          {anime.studio && (
            <p className="text-xs text-gray-500 flex items-center">
              <i className="ri-building-line mr-1"></i>
              {anime.studio}
            </p>
          )}
          
          {anime.year && (
            <p className="text-xs text-gray-500 flex items-center">
              <i className="ri-calendar-line mr-1"></i>
              {anime.year}
              {anime.episodes && ` • ${anime.episodes} episodes`}
            </p>
          )}

          <div className="flex flex-wrap gap-1 mt-2">
            {anime.genre?.slice(0, 2).map((genre) => (
              <GenreBadge key={genre} genre={genre} size="small" />
            ))}
            {anime.genre?.length > 2 && (
              <span className="text-xs text-gray-400">
                +{anime.genre.length - 2} more
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;