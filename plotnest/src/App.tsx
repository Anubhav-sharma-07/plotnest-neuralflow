import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { PlotNestProvider } from './context/PlotNestContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { ToastContainer } from './components/ToastContainer';

// Screens
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { TodayPage } from './pages/TodayPage';
import { DashboardPage } from './pages/DashboardPage';
import { LeadListPage } from './pages/LeadListPage';
import { LeadDetailPage } from './pages/LeadDetailPage';
import { AssignmentQueuePage } from './pages/AssignmentQueuePage';
import { LeadStatusFlowPage } from './pages/LeadStatusFlowPage';
import { SiteVisitsPage } from './pages/SiteVisitsPage';
import { PlotInventoryPage } from './pages/PlotInventoryPage';
import { TeamHierarchyPage } from './pages/TeamHierarchyPage';
import { ExcelImportPage } from './pages/ExcelImportPage';
import { DesignSystemPage } from './pages/DesignSystemPage';
import { DemoGuidePage } from './pages/DemoGuidePage';
import { NotificationPage } from './pages/NotificationPage';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans text-[#1F2937]">
      <Header />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {!isLandingPage && <Sidebar />}
        <main
          className={`flex-1 w-full min-w-0 ${
            isLandingPage ? 'p-0' : 'p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8'
          }`}
        >
          {children}
        </main>
      </div>
      <MobileNav />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <PlotNestProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/today" element={<TodayPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/leads" element={<LeadListPage />} />
            <Route path="/leads/:id" element={<LeadDetailPage />} />
            <Route path="/assignments" element={<AssignmentQueuePage />} />
            <Route path="/pipeline" element={<LeadStatusFlowPage />} />
            <Route path="/visits" element={<SiteVisitsPage />} />
            <Route path="/plots" element={<PlotInventoryPage />} />
            <Route path="/team" element={<TeamHierarchyPage />} />
            <Route path="/import" element={<ExcelImportPage />} />
            <Route path="/design" element={<DesignSystemPage />} />
            <Route path="/demo-guide" element={<DemoGuidePage />} />
            <Route path="/notifications" element={<NotificationPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </PlotNestProvider>
  );
}
