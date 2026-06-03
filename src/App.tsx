import { HashRouter, Routes, Route } from 'react-router-dom';
import { PlannerProvider } from './context/PlannerContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CalendarPage from './pages/Calendar';
import DailyPlanner from './pages/DailyPlanner';
import Stats from './pages/Stats';
import Profiles from './pages/Profiles';

function App() {
  return (
    <PlannerProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="day/:date" element={<DailyPlanner />} />
            <Route path="stats" element={<Stats />} />
            <Route path="profiles" element={<Profiles />} />
          </Route>
        </Routes>
      </HashRouter>
    </PlannerProvider>
  );
}

export default App;
