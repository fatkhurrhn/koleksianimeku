import { Link } from 'react-router-dom';

const GenreBadge = ({ genre, size = 'normal', clickable = true, className = '' }) => {
  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    normal: 'px-3 py-1 text-sm'
  };

  const baseClasses = `inline-flex items-center rounded-full font-medium transition-colors ${sizeClasses[size]} ${className}`;
  
  const colorMap = {
    'Action': 'bg-red-100 text-red-700 hover:bg-red-200',
    'Adventure': 'bg-green-100 text-green-700 hover:bg-green-200',
    'Comedy': 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
    'Drama': 'bg-purple-100 text-purple-700 hover:bg-purple-200',
    'Fantasy': 'bg-pink-100 text-pink-700 hover:bg-pink-200',
    'Romance': 'bg-rose-100 text-rose-700 hover:bg-rose-200',
    'Supernatural': 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
    'School': 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    'Historical': 'bg-amber-100 text-amber-700 hover:bg-amber-200',
    'Family': 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
    'Superhero': 'bg-orange-100 text-orange-700 hover:bg-orange-200',
    'Martial Arts': 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  };

  const colorClass = colorMap[genre] || 'bg-gray-100 text-gray-700 hover:bg-gray-200';

  if (clickable) {
    return (
      <Link
        to={`/genre/${encodeURIComponent(genre)}`}
        className={`${baseClasses} ${colorClass}`}
      >
        {genre}
      </Link>
    );
  }

  return (
    <span className={`${baseClasses} ${colorClass}`}>
      {genre}
    </span>
  );
};

export default GenreBadge;