import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BeanPage from './pages/BeanPage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/beans/:id" element={<BeanPage />} />
      </Routes>
    </HashRouter>
  );
}
