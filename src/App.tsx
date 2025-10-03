import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RaceDetailPage from './pages/RaceDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/race/:year" element={<RaceDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
