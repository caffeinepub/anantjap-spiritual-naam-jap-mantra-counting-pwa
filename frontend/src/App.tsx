import { useEffect, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Header from './components/Header';
import Footer from './components/Footer';
import LeftSidebar from './components/LeftSidebar';
import HomePage from './pages/HomePage';
import JapCountPage from './pages/JapCountPage';
import BhajanMargPage from './pages/BhajanMargPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import CopyrightPage from './pages/CopyrightPage';
import FeedbackPage from './pages/FeedbackPage';
import FirstLaunchWarning from './components/FirstLaunchWarning';
import { LanguageProvider } from './contexts/LanguageContext';
import { DevoteeProvider } from './contexts/DevoteeContext';

type Page = 'home' | 'japcount' | 'bhajanmarg' | 'dashboard' | 'settings' | 'terms' | 'privacy' | 'copyright' | 'feedback';

interface GodInfo {
  id: string;
  name: string;
  image: string;
}

const DEFAULT_GODS: Record<string, GodInfo> = {
  ganesh: { id: 'ganesh', name: 'Ganesh', image: '/assets/generated/ganesh-deity.dim_400x400.png' },
  vishnu: { id: 'vishnu', name: 'Vishnu', image: '/assets/generated/vishnu-deity.dim_400x400.png' },
  shiv: { id: 'shiv', name: 'Shiv', image: '/assets/generated/shiv-deity.dim_400x400.png' },
  durga: { id: 'durga', name: 'Durga', image: '/assets/generated/durga-deity.dim_400x400.png' },
  surya: { id: 'surya', name: 'Surya', image: '/assets/generated/surya-deity.dim_400x400.png' },
};

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedGodId, setSelectedGodId] = useState<string | null>(null);
  const [selectedGodInfo, setSelectedGodInfo] = useState<GodInfo | null>(null);

  useEffect(() => {
    const hasSeenWarning = localStorage.getItem('anantjap_seen_warning');
    if (!hasSeenWarning) {
      localStorage.setItem('anantjap_seen_warning', 'true');
    }
  }, []);

  useEffect(() => {
    if (selectedGodId) {
      if (DEFAULT_GODS[selectedGodId]) {
        setSelectedGodInfo(DEFAULT_GODS[selectedGodId]);
      } else {
        // Try to load custom god info
        const customGods = localStorage.getItem('anantjap_custom_gods');
        if (customGods) {
          const gods = JSON.parse(customGods);
          const customGod = gods.find((g: any) => g.id === selectedGodId);
          if (customGod) {
            setSelectedGodInfo({ id: customGod.id, name: customGod.name, image: customGod.image });
          }
        }
      }
    } else {
      setSelectedGodInfo(null);
    }
  }, [selectedGodId]);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGodSelect = (godId: string) => {
    setSelectedGodId(godId);
    setCurrentPage('japcount');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onGodSelect={handleGodSelect} />;
      case 'japcount':
        return <JapCountPage selectedGodId={selectedGodId} onBack={() => setCurrentPage('home')} />;
      case 'bhajanmarg':
        return <BhajanMargPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'settings':
        return <SettingsPage />;
      case 'terms':
        return <TermsPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'copyright':
        return <CopyrightPage />;
      case 'feedback':
        return <FeedbackPage />;
      default:
        return <HomePage onGodSelect={handleGodSelect} />;
    }
  };

  const sidebarNavPage = ['home', 'japcount', 'bhajanmarg', 'dashboard', 'settings'].includes(currentPage)
    ? (currentPage as 'home' | 'japcount' | 'bhajanmarg' | 'dashboard' | 'settings')
    : 'home';

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <LanguageProvider>
        <DevoteeProvider>
          <div className="min-h-screen flex">
            {/* Left Sidebar */}
            <LeftSidebar
              currentPage={sidebarNavPage}
              onNavigate={handleNavigate}
              godImageSrc={selectedGodInfo?.image ?? null}
              godName={selectedGodInfo?.name ?? null}
            />

            {/* Main content offset by sidebar width */}
            <div className="flex-1 flex flex-col min-h-screen pl-[72px]">
              <FirstLaunchWarning />
              <Header />
              <main className="flex-1">
                {renderPage()}
              </main>
              <Footer onNavigate={handleNavigate} />
            </div>
          </div>
          <Toaster />
        </DevoteeProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
