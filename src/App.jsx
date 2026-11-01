import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BeanPage from './pages/BeanPage';
import Archive from './pages/Archive';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/beans/:id" element={<BeanPage />} />
      </Routes>
    </HashRouter>
  );
}
