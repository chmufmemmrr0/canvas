
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Pong from './pages/Pong';
import Bird from './pages/Bird';
import Runner from './pages/Runner';
import TicTacToe from './pages/TicTacToe';
import Bombs from './pages/Bombs';
import Snake from './pages/Snake';
import Maze from './pages/Maze';
import Fruit from './pages/Fruit';
import Breakout from './pages/Breakout';

const App = () => {
  return (
    <HashRouter basename="/">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Pong" element={<Pong />} />
        <Route path="/Bird" element={<Bird />} />
        <Route path="/Runner" element={<Runner />} />
        <Route path="/TicTacToe" element={<TicTacToe />} />
        <Route path="/Bombs" element={<Bombs />} />
        <Route path="/Snake" element={<Snake />} />
        <Route path="/Maze" element={<Maze />} />
        <Route path="/Fruit" element={<Fruit />} />
        <Route path="/Breakout" element={<Breakout />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
