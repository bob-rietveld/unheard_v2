import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PersonasPage from './pages/PersonasPage';
import ExperimentsPage from './pages/ExperimentsPage';
import ResultsPage from './pages/ResultsPage';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

function App() {
  return (
    <ConvexProvider client={convex}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="personas" element={<PersonasPage />} />
            <Route path="experiments" element={<ExperimentsPage />} />
            <Route path="results" element={<ResultsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConvexProvider>
  );
}

export default App;
