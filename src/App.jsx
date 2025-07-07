import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import AnimeDetail from './pages/AnimeDetail.jsx';
import EpisodePlayer from './pages/EpisodePlayer.jsx';
import Search from './pages/Search.jsx';
import Genre from './pages/Genre.jsx';
import Status from './pages/Status.jsx';
import More from './pages/More.jsx';
import './App.css';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/anime/:id" element={<AnimeDetail />} />
        <Route path="/anime/:id/episode/:episodeNumber" element={<EpisodePlayer />} />
        <Route path="/search" element={<Search />} />
        <Route path="/genre" element={<Genre />} />
        <Route path="/genre/:genreName" element={<Genre />} />
        <Route path="/status" element={<Status />} />
        <Route path="/more" element={<More />} />
      </Routes>
    </Layout>
  );
}

export default App;