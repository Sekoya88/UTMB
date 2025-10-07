import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RaceDetailPage from './pages/RaceDetailPage';
import CourseMapPage from './pages/CourseMapPage';
import AnnexesPage from './pages/AnnexesPage';
import CheckpointAnalysisPage from './pages/CheckpointAnalysisPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/race/:year" element={<RaceDetailPage />} />
        <Route path="/course-map" element={<CourseMapPage />} />
        <Route path="/annexes" element={<AnnexesPage />} />
        <Route path="/checkpoint-analysis" element={<CheckpointAnalysisPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
