import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { matchRoute, navigate, usePathname } from '../lib/router';
import { AuthProvider, useAuth } from './AuthContext';
import { ToastProvider } from './ToastContext';
import { CategoriesPage } from './pages/CategoriesPage';
import { DashboardPage } from './pages/DashboardPage';
import { FaqsPage } from './pages/FaqsPage';
import { LeadsPage } from './pages/LeadsPage';
import { LoginPage } from './pages/LoginPage';
import { ServiceFormPage } from './pages/ServiceFormPage';
import { ServicesPage } from './pages/ServicesPage';
import { SettingsPage } from './pages/SettingsPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { TrustPillarsPage } from './pages/TrustPillarsPage';

const FullScreenLoader: React.FC = () => (
  <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
    <Loader2 className="w-6 h-6 animate-spin text-[#F5C400]" />
  </div>
);

/** Routes are resolved in order; the first match wins. */
const resolveRoute = (pathname: string): React.ReactNode => {
  if (matchRoute('/admin/dashboard', pathname)) return <DashboardPage />;
  if (matchRoute('/admin/services', pathname)) return <ServicesPage />;
  if (matchRoute('/admin/services/create', pathname)) return <ServiceFormPage />;

  const editMatch = matchRoute('/admin/services/:id/edit', pathname);
  if (editMatch) return <ServiceFormPage serviceId={editMatch.id} />;

  if (matchRoute('/admin/categories', pathname)) return <CategoriesPage />;
  if (matchRoute('/admin/testimonials', pathname)) return <TestimonialsPage />;
  if (matchRoute('/admin/faqs', pathname)) return <FaqsPage />;
  if (matchRoute('/admin/trust-pillars', pathname)) return <TrustPillarsPage />;
  if (matchRoute('/admin/leads', pathname)) return <LeadsPage />;
  if (matchRoute('/admin/settings', pathname)) return <SettingsPage />;

  return null;
};

const AdminRouter: React.FC = () => {
  const pathname = usePathname();
  const { status } = useAuth();

  // Keep the admin area out of search results without touching the public SEO tags.
  useEffect(() => {
    document.title = 'Admin portal | Garage Services Auto et Centre de Transmission';
    let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      document.head.appendChild(robots);
    }
    robots.content = 'noindex, nofollow';

    return () => {
      robots?.remove();
    };
  }, []);

  // `/admin` and any unknown admin path land on the dashboard.
  useEffect(() => {
    if (status === 'checking') return;

    const isLogin = pathname === '/admin/login';
    if (status === 'anonymous' && !isLogin) {
      navigate('/admin/login', { replace: true });
      return;
    }
    if (status === 'authenticated' && (isLogin || resolveRoute(pathname) === null)) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [pathname, status]);

  if (status === 'checking') return <FullScreenLoader />;
  if (status === 'anonymous') return <LoginPage />;

  return <>{resolveRoute(pathname) ?? <FullScreenLoader />}</>;
};

/** Entry point for everything served under /admin. */
const AdminApp: React.FC = () => (
  <ToastProvider>
    <AuthProvider>
      <AdminRouter />
    </AuthProvider>
  </ToastProvider>
);

export default AdminApp;
