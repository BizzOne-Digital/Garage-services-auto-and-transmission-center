import React, { useEffect, useState } from 'react';
import {
  ChevronDown,
  ExternalLink,
  HelpCircle,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  Settings as SettingsIcon,
  ShieldCheck,
  Tags,
  Users,
  Wrench,
  X,
} from 'lucide-react';
import { Link, usePathname } from '../../lib/router';
import { useBusiness } from '../../i18n/useContent';
import { useAuth } from '../AuthContext';
import { Button } from './ui';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  /** Also highlight the item for nested routes such as /admin/services/create. */
  prefix?: boolean;
}

const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: 'Overview',
    items: [{ href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    title: 'Content',
    items: [
      { href: '/admin/services', label: 'Services', icon: Wrench, prefix: true },
      { href: '/admin/categories', label: 'Categories', icon: Tags },
      { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
      { href: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
      { href: '/admin/trust-pillars', label: 'Trust pillars', icon: ShieldCheck },
    ],
  },
  {
    title: 'Business',
    items: [
      { href: '/admin/leads', label: 'Leads', icon: Users },
      { href: '/admin/media', label: 'Media', icon: ImageIcon },
      { href: '/admin/settings', label: 'Settings', icon: SettingsIcon },
    ],
  },
];

const isActive = (item: NavItem, pathname: string): boolean =>
  item.prefix ? pathname.startsWith(item.href) : pathname === item.href;

export const AdminLayout: React.FC<{
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, description, actions, children }) => {
  const pathname = usePathname();
  const business = useBusiness();
  const { admin, logout } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMobileNavOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  const sidebar = (
    <nav aria-label="Admin sections" className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-5 h-16 border-b border-neutral-800 shrink-0">
        {business.logoUrl ? (
          <img
            src={business.logoUrl}
            alt=""
            className="w-8 h-8 rounded-lg object-contain bg-[#0A0A0A]"
          />
        ) : (
          <span className="w-8 h-8 rounded-lg bg-[#F5C400] text-[#0A0A0A] font-heading font-black flex items-center justify-center text-sm">
            G
          </span>
        )}
        <span className="min-w-0">
          <span className="block font-heading text-xs font-bold uppercase tracking-wider text-white truncate">
            {business.shortName || 'Garage Services'}
          </span>
          <span className="block text-[10px] font-mono uppercase tracking-widest text-[#F5C400]">
            Admin portal
          </span>
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
        {NAV_GROUPS.map(group => (
          <div key={group.title}>
            <p className="px-2 mb-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-600">
              {group.title}
            </p>
            <ul className="space-y-1">
              {group.items.map(item => {
                const active = isActive(item, pathname);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                        active
                          ? 'bg-[#F5C400]/10 text-[#F5C400] border border-[#F5C400]/30'
                          : 'text-neutral-400 hover:text-white hover:bg-[#1A1A1A] border border-transparent'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="px-3 py-4 border-t border-neutral-800 shrink-0">
        <a
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-[#F5C400] hover:bg-[#1A1A1A] transition-colors"
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          View website
        </a>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F3F3F3] font-sans selection:bg-[#F5C400] selection:text-[#0A0A0A]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col bg-[#101010] border-r border-neutral-800 z-30">
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      {mobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileNavOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] bg-[#101010] border-r border-neutral-800 flex flex-col">
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              aria-label="Close navigation"
              className="absolute top-4 right-3 p-1.5 rounded-lg text-neutral-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 h-16 px-4 sm:px-6 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-neutral-800">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open navigation"
            className="lg:hidden p-2 -ml-2 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1A1A1A]"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="font-heading text-sm sm:text-base font-bold uppercase tracking-wider text-white truncate">
              {title}
            </h1>
            {description && (
              <p className="hidden sm:block text-[11px] text-neutral-500 truncate">{description}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {actions}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen(open => !open)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 px-2.5 py-2 rounded-xl border border-neutral-800 hover:border-neutral-600 transition-colors"
              >
                <span className="w-6 h-6 rounded-lg bg-[#F5C400] text-[#0A0A0A] text-[10px] font-black flex items-center justify-center uppercase">
                  {(admin?.name || admin?.email || 'A').slice(0, 1)}
                </span>
                <span className="hidden sm:block text-[11px] font-bold uppercase tracking-wider text-neutral-300 max-w-[10rem] truncate">
                  {admin?.name || admin?.email}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-[#141414] border border-neutral-700 shadow-2xl overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-neutral-800">
                    <p className="text-xs font-bold text-white truncate">{admin?.name}</p>
                    <p className="text-[11px] text-neutral-500 truncate">{admin?.email}</p>
                  </div>
                  <Link
                    to="/admin/settings"
                    className="flex items-center gap-2.5 px-4 py-3 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white hover:bg-[#1A1A1A] transition-colors"
                  >
                    <SettingsIcon className="w-4 h-4" />
                    Settings
                  </Link>
                  <button
                    type="button"
                    onClick={() => void logout()}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold uppercase tracking-wider text-red-300 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-6 py-6 max-w-[100rem]">{children}</main>
      </div>
    </div>
  );
};

export const PageActions: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-2">{children}</div>
);

export { Button };
