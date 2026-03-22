import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BottomNav } from './components/BottomNav';
import { AthletesPage } from './pages/AthletesPage';
import { AthleteDetailPage } from './pages/AthleteDetailPage';
import { AssessPage } from './pages/AssessPage';
import { HistoryPage } from './pages/HistoryPage';
import { HistoryDetailPage } from './pages/HistoryDetailPage';
import { AssessmentWizard } from './assessment/AssessmentWizard';

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100svh', maxWidth: 600, margin: '0 auto', background: '#F9FAFB', position: 'relative' }}>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}

function WizardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100svh', maxWidth: 600, margin: '0 auto', background: '#F9FAFB' }}>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Navigate to="/athletes" replace />} />

        {/* Athletes */}
        <Route path="/athletes" element={
          <AppLayout><AthletesPage /></AppLayout>
        } />
        <Route path="/athletes/:id" element={
          <AppLayout><AthleteDetailPage /></AppLayout>
        } />

        {/* Assess */}
        <Route path="/assess" element={
          <AppLayout><AssessPage /></AppLayout>
        } />
        <Route path="/assess/:id" element={
          <WizardLayout><AssessmentWizard /></WizardLayout>
        } />

        {/* History */}
        <Route path="/history" element={
          <AppLayout><HistoryPage /></AppLayout>
        } />
        <Route path="/history/:id" element={
          <AppLayout><HistoryDetailPage /></AppLayout>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/athletes" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
