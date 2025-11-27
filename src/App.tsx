
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
// import TuneTable from './pages/TuneTable';
// import QuizCategories from './pages/QuizCategories';
// import QuizQuestion from './pages/QuizQuestion';

const App = () => {
  return (
    <HashRouter basename="/">
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/QuizCategories" element={<QuizCategories />} />
        <Route path="/QuizQuestion" element={<QuizQuestion />} />
        <Route path="/TuneTable" element={<TuneTable />} /> */}
      </Routes>
    </HashRouter>
  );
};

export default App;
