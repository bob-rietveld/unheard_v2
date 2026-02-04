import { HashRouter, Routes, Route } from 'react-router-dom';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PersonasPage from './pages/PersonasPage';
import ExperimentsPage from './pages/ExperimentsPage';
import ResultsPage from './pages/ResultsPage';

// Validate Convex URL at startup
const convexUrl = import.meta.env.VITE_CONVEX_URL;
if (!convexUrl) {
  throw new Error(
    'VITE_CONVEX_URL environment variable is not set. ' +
    'Please create a .env.local file with your Convex deployment URL.'
  );
}
const convex = new ConvexReactClient(convexUrl);

function App() {
  return (
    <ConvexProvider client={convex}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="personas" element={<PersonasPage />} />
            <Route path="experiments" element={<ExperimentsPage />} />
            <Route path="results" element={<ResultsPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </ConvexProvider>
  );
}

export default App;
