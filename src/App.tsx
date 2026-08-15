import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import AIForecast from './pages/AIForecast';
import PollutionMap from './pages/PollutionMap';
import Alerts from './pages/Alerts';
import AIInsights from './pages/AIInsights';
import CityZones from './pages/CityZones';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

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
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/insights" element={<AIInsights />} />
          <Route path="/zones" element={<CityZones />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
