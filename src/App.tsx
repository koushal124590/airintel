import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import AIForecast from './pages/AIForecast';
import PollutionMap from './pages/PollutionMap';

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden flex dark">
      <Sidebar />
      <div className="flex-1 flex flex-col w-full md:ml-[280px]">
        <Header />
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/forecast" element={<AIForecast />} />
          <Route path="/map" element={<PollutionMap />} />
          {/* Add more routes here later */}
          <Route path="*" element={<div className="p-8 text-on-surface">Page not implemented yet.</div>} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
