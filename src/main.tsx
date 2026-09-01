import {StrictMode, Suspense, lazy} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {OfflineScreen} from './components/OfflineScreen';
import {SiteContentProvider} from './content/SiteContentContext';
import {LanguageProvider} from './i18n/LanguageContext';
import './index.css';

// The admin portal is a separate chunk so visitors to the public site never
// download it. Everything outside /admin renders the website exactly as before.
const AdminApp = lazy(() => import('./admin/AdminApp'));

const isAdminRoute = window.location.pathname.startsWith('/admin');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      {/* Covers the public site and the admin portal alike. */}
      <OfflineScreen />
      <SiteContentProvider>
        {isAdminRoute ? (
          <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A]" />}>
            <AdminApp />
          </Suspense>
        ) : (
          <App />
        )}
      </SiteContentProvider>
    </LanguageProvider>
  </StrictMode>,
);
