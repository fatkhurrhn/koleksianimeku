import React, { useState, useEffect } from 'react';
import { db, serverTimestamp } from "../../firebase";
import { collection, query, orderBy, where, addDoc, updateDoc, doc, deleteDoc, getDocs } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import LogoutConfirmModal from "../../components/LogoutConfirmModal";
import Layout from '../../components/Layout';

const genres = [
  "Action", "Adventure", "Reincarnation", "Comedy", "Drama", "Fantasy", "Harem",
  "Romance", "Seinen", "Shounen", "Sci-Fi", "Supernatural", "Mythology", "Thriller", "School",
  "Slice of Life", "Martial Arts", "Magic", "Historical", "Psychology", "Military", "Sports",
  "Music", "Mecha", "Demons", "Vampire", "Horror", "Game", "Isekai", "Dementia", "Parody",
  "Police", "Samurai", "Kids", "Josei", "Shoujo", "Yaoi", "Yuri", "Ecchi"
];

const ManageAnime = () => {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    genres: [],
    episodes: '',
    year: '',
    studio: '',
    status: 'completed',
    rating: '',
    lastWatchedEpisode: '',
    thumbnail: '',
    description: '',
    episodeList: []
  });
  const [currentEpisode, setCurrentEpisode] = useState({
    number: '',
    title: '',
    embedUrl: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [animeToDelete, setAnimeToDelete] = useState(null);
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/anime");
    } catch (error) {
      console.error("Error logging out: ", error);
      alert("Logout gagal: " + error.message);
    }
  };

  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        const q = query(collection(db, 'animes'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const animesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAnimes(animesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching animes: ", error);
        setLoading(false);
      }
    };

    fetchAnimes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleGenreChange = (genre) => {
    const updatedGenres = formData.genres.includes(genre)
      ? formData.genres.filter(g => g !== genre)
      : [...formData.genres, genre];

    setFormData({
      ...formData,
      genres: updatedGenres
    });
  };

  const handleEpisodeInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEpisode({
      ...currentEpisode,
      [name]: value
    });
  };

  const addEpisode = () => {
    if (currentEpisode.number && currentEpisode.title && currentEpisode.embedUrl) {
      setFormData({
        ...formData,
        episodeList: [
          ...formData.episodeList,
          {
            number: parseInt(currentEpisode.number),
            title: currentEpisode.title,
            embedUrl: currentEpisode.embedUrl
          }
        ].sort((a, b) => a.number - b.number)
      });
      setCurrentEpisode({
        number: '',
        title: '',
        embedUrl: ''
      });
    }
  };

  const removeEpisode = (index) => {
    const updatedEpisodes = [...formData.episodeList];
    updatedEpisodes.splice(index, 1);
    setFormData({
      ...formData,
      episodeList: updatedEpisodes
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editMode) {
        const animeRef = doc(db, 'animes', currentId);
        await updateDoc(animeRef, {
          ...formData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'animes'), {
          ...formData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      resetForm();
      const q = query(collection(db, 'animes'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const animesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAnimes(animesData);
      setLoading(false);
      setShowModal(false);
    } catch (error) {
      console.error("Error adding/updating anime: ", error);
      setLoading(false);
    }
  };

  const editAnime = (anime) => {
    setFormData({
      title: anime.title,
      genres: anime.genres,
      episodes: anime.episodes,
      year: anime.year,
      studio: anime.studio,
      status: anime.status,
      rating: anime.rating,
      lastWatchedEpisode: anime.lastWatchedEpisode || '',
      thumbnail: anime.thumbnail,
      description: anime.description,
      episodeList: anime.episodeList || []
    });
    setCurrentId(anime.id);
    setEditMode(true);
    setShowModal(true);
  };

  const confirmDelete = (anime) => {
    setAnimeToDelete(anime);
    setShowDeleteModal(true);
  };

  const deleteAnime = async () => {
    try {
      await deleteDoc(doc(db, 'animes', animeToDelete.id));
      setAnimes(animes.filter(anime => anime.id !== animeToDelete.id));
      setShowDeleteModal(false);
      setAnimeToDelete(null);
    } catch (error) {
      console.error("Error deleting anime: ", error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      genres: [],
      episodes: '',
      year: '',
      studio: '',
      status: 'completed',
      rating: '',
      lastWatchedEpisode: '',
      thumbnail: '',
      description: '',
      episodeList: []
    });
    setCurrentEpisode({
      number: '',
      title: '',
      embedUrl: ''
    });
    setEditMode(false);
    setCurrentId('');
    setShowModal(false);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto max-w-full px-2 py-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="px-4 py-2 mb-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Add New Anime
            </button>
          </div>

          <div className="rounded-lg overflow-hidden">
            {loading && !animes.length ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">Loading...</p>
              </div>
            ) : animes.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">No animes found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-1">
                {animes.map(anime => (
                  <div key={anime.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative aspect-[3/4]">
                      <img
                        src={anime.thumbnail}
                        alt={anime.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                        <h3 className="font-medium text-white text-lg line-clamp-1">{anime.title}</h3>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-300">
                            {anime.episodes} eps • {anime.year}
                          </span>
                          <span className="text-xs bg-black/70 text-white px-1.5 py-0.5 rounded">
                            ⭐{anime.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {anime.genres.length === 2 ? (
                          anime.genres.map((genre) => (
                            <span key={genre} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                              {genre}
                            </span>
                          ))
                        ) : (
                          <>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                              {anime.genres[0]}
                            </span>
                            {anime.genres.length > 2 && (
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                                +{anime.genres.length - 1} more
                              </span>
                            )}
                          </>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {anime.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded ${anime.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : anime.status === 'watching'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-purple-100 text-purple-800'
                          }`}>
                          {anime.status === 'completed' ? 'Completed' :
                            anime.status === 'watching' ? 'Watch' : 'Planned'}
                          {anime.status === 'watching' && anime.lastWatchedEpisode && (
                            ` - Eps ${anime.lastWatchedEpisode}`
                          )}
                        </span>

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => editAnime(anime)}
                            className="text-gray-500 hover:text-gray-700 p-1"
                            title="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => confirmDelete(anime)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Delete"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center mb-4">
                      <button
                        onClick={resetForm}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50"
                      >
                        {loading ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </span>
                        ) : editMode ? 'Update Anime' : 'Add Anime'}
                      </button>
                    </div>
                    <hr className='pb-4'></hr>

                    <div className="flex flex-wrap gap-4 mb-4">
                      <div style={{ width: '350px' }}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                        />
                      </div>

                      <div style={{ width: '200px' }}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Studio</label>
                        <input
                          type="text"
                          name="studio"
                          value={formData.studio}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                        />
                      </div>

                      <div style={{ width: '110px' }}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                        <input
                          type="text"
                          step="0.1"
                          min="0"
                          max="10"
                          name="rating"
                          value={formData.rating}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-4">
                      <div style={{ width: '120px' }}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                        <input
                          type="text"
                          name="year"
                          value={formData.year}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                        />
                      </div>

                      <div style={{ width: '70px' }}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Episodes</label>
                        <input
                          type="text"
                          name="episodes"
                          value={formData.episodes}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                        />
                      </div>

                      <div style={{ width: '150px' }}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                        >
                          <option value="completed">Completed</option>
                          <option value="watching">Watching</option>
                          <option value="planning">Planning</option>
                        </select>
                      </div>

                      <div style={{ width: '310px' }}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
                        <input
                          type="url"
                          name="thumbnail"
                          value={formData.thumbnail}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                        />
                      </div>
                    </div>

                    {formData.thumbnail && (
                      <div className="mb-4">
                        <img
                          src={formData.thumbnail}
                          alt="Thumbnail preview"
                          className="h-24 object-cover rounded border"
                        />
                      </div>
                    )}

                    {formData.status === 'watching' && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Watched Episode</label>
                        <input
                          type="text"
                          name="lastWatchedEpisode"
                          value={formData.lastWatchedEpisode}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                        />
                      </div>
                    )}

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-3 py-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                      ></textarea>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Genres</label>
                      <div className="flex flex-wrap gap-2">
                        {genres.map(genre => (
                          <button
                            key={genre}
                            type="button"
                            onClick={() => handleGenreChange(genre)}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${formData.genres.includes(genre)
                              ? 'bg-gray-500 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                          >
                            {genre}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-700 mb-3">Episodes</h3>

                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="w-[50px]">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Episode</label>
                          <input
                            type="text"
                            name="number"
                            value={currentEpisode.number}
                            onChange={handleEpisodeInputChange}
                            className="w-full px-3 py-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                          />
                        </div>

                        <div className="w-[100px]">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Episode Title</label>
                          <input
                            type="text"
                            name="title"
                            value={currentEpisode.title}
                            onChange={handleEpisodeInputChange}
                            className="w-full px-3 py-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                            placeholder='bebas'
                          />
                        </div>

                        <div className="w-[520px]">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Embed Code</label>
                          <input
                            type="text"
                            name="embedUrl"
                            value={currentEpisode.embedUrl}
                            onChange={handleEpisodeInputChange}
                            placeholder="Paste embed iframe code here"
                            className="w-full px-3 py-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                          />
                        </div>
                      </div>


                      <button
                        type="button"
                        onClick={addEpisode}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 mb-4 transition-colors disabled:opacity-50"
                        disabled={!currentEpisode.number || !currentEpisode.title || !currentEpisode.embedUrl}
                      >
                        Add Episode
                      </button>

                      {formData.episodeList.length > 0 && (
                        <div className="border rounded-md divide-y">
                          {formData.episodeList.map((episode, index) => (
                            <div key={index} className="p-3 flex justify-between items-center">
                              <div className="truncate text-gray-800">
                                <span className="font-medium">Episode {episode.number}:</span> {episode.embedUrl}
                              </div>
                              <button
                                type="button"
                                onClick={() => removeEpisode(index)}
                                className="text-red-500 hover:text-red-700 ml-2"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t">

                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          <LogoutConfirmModal
            isOpen={showLogoutModal}
            onClose={() => setShowLogoutModal(false)}
            onConfirm={handleLogout}
          />

          {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Confirm Delete</h2>
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <p className="mb-6 text-gray-600">
                    Are you sure you want to delete <span className="font-semibold">{animeToDelete?.title}</span>? This action cannot be undone.
                  </p>

                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={deleteAnime}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ManageAnime;