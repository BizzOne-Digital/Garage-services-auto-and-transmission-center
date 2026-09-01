import React from 'react';
import {
  ArrowUpRight,
  FileEdit,
  HelpCircle,
  MessageSquareQuote,
  ShieldCheck,
  Sparkles,
  Tags,
  Users,
  Wrench,
} from 'lucide-react';
import type { DashboardStats } from '../../lib/content-types';
import { Link } from '../../lib/router';
import { adminApi } from '../api';
import { AdminLayout } from '../components/AdminLayout';
import { Badge, Button, EmptyState, ErrorState, Panel, Spinner } from '../components/ui';
import { useAsyncData } from '../hooks';

const StatCard: React.FC<{
  label: string;
  value: number | string;
  hint?: string;
  icon: React.ElementType;
  accent?: boolean;
  to?: string;
}> = ({ label, value, hint, icon: Icon, accent, to }) => {
  const body = (
    <div
      className={`h-full rounded-2xl border p-5 transition-colors ${
        accent
          ? 'bg-gradient-to-b from-[#1E1B0A] to-[#121212] border-[#F5C400]/30'
          : 'bg-[#121212] border-neutral-800 hover:border-neutral-700'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-500">
          {label}
        </span>
        <Icon className={`w-4 h-4 shrink-0 ${accent ? 'text-[#F5C400]' : 'text-neutral-600'}`} />
      </div>
      <p className="font-heading text-3xl font-black text-white mt-3 tabular-nums">{value}</p>
      {hint && <p className="text-[11px] text-neutral-500 mt-1">{hint}</p>}
    </div>
  );

  return to ? (
    <Link to={to} className="block h-full">
      {body}
    </Link>
  ) : (
    body
  );
};

const formatDate = (value: string): string =>
  new Date(value).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });

const LEAD_TONES: Record<string, 'yellow' | 'green' | 'neutral' | 'red' | 'blue'> = {
  new: 'yellow',
  contacted: 'blue',
  quoted: 'blue',
  won: 'green',
  lost: 'red',
};

export const DashboardPage: React.FC = () => {
  const { data, loading, error, reload } = useAsyncData<DashboardStats>(() => adminApi.stats());

  return (
    <AdminLayout
      title="Dashboard"
      description="Content health and incoming quote requests at a glance"
      actions={
        <Link to="/admin/services/create">
          <Button size="sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New service</span>
          </Button>
        </Link>
      }
    >
      {loading && <Spinner label="Loading statistics" />}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}

      {!loading && !error && data && (
        <div className="space-y-6">
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Services"
              value={data.services.total}
              hint={`${data.services.published} published · ${data.services.draft} draft`}
              icon={Wrench}
              accent
              to="/admin/services"
            />
            <StatCard
              label="New leads"
              value={data.leads.new}
              hint={`${data.leads.last7Days} in the last 7 days`}
              icon={Users}
              to="/admin/leads"
            />
            <StatCard
              label="Categories"
              value={data.categories}
              hint="Service filter tabs"
              icon={Tags}
              to="/admin/categories"
            />
            <StatCard
              label="Testimonials"
              value={data.testimonials.total}
              hint={`${data.testimonials.published} published`}
              icon={MessageSquareQuote}
              to="/admin/testimonials"
            />
          </div>

          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Featured"
              value={data.services.featured}
              hint="Highlighted services"
              icon={Sparkles}
            />
            <StatCard
              label="Trust pillars"
              value={data.trustPillars}
              hint="Value props under the hero"
              icon={ShieldCheck}
              to="/admin/trust-pillars"
            />
            <StatCard
              label="FAQs"
              value={data.faqs.total}
              hint={`${data.faqs.published} published`}
              icon={HelpCircle}
              to="/admin/faqs"
            />
            <StatCard
              label="Total leads"
              value={data.leads.total}
              hint="All time"
              icon={Users}
              to="/admin/leads"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Panel
              title="Recently added services"
              actions={
                <Link
                  to="/admin/services"
                  className="text-[11px] font-bold uppercase tracking-wider text-[#F5C400] hover:underline inline-flex items-center gap-1"
                >
                  View all <ArrowUpRight className="w-3 h-3" />
                </Link>
              }
            >
              {data.recentServices.length === 0 ? (
                <EmptyState
                  title="No services yet"
                  description="Run the seed script or create your first service to populate the website."
                  action={
                    <Link to="/admin/services/create">
                      <Button size="sm">Create service</Button>
                    </Link>
                  }
                />
              ) : (
                <ul className="divide-y divide-neutral-800">
                  {data.recentServices.map(service => (
                    <li key={service._id}>
                      <Link
                        to={`/admin/services/${service._id}/edit`}
                        className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#161616] transition-colors"
                      >
                        <span className="w-9 h-9 rounded-lg bg-[#1A1A1A] border border-neutral-800 flex items-center justify-center overflow-hidden shrink-0">
                          {service.imageUrl ? (
                            <img src={service.imageUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Wrench className="w-4 h-4 text-neutral-600" />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-xs font-bold text-white truncate">
                            {service.title?.fr || service.title?.en || service.slug}
                          </span>
                          <span className="block text-[11px] text-neutral-500 font-mono truncate">
                            {service.categoryKey} · {formatDate(service.createdAt)}
                          </span>
                        </span>
                        <Badge tone={service.published ? 'green' : 'neutral'}>
                          {service.published ? 'Published' : 'Draft'}
                        </Badge>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <Panel
              title="Latest quote requests"
              actions={
                <Link
                  to="/admin/leads"
                  className="text-[11px] font-bold uppercase tracking-wider text-[#F5C400] hover:underline inline-flex items-center gap-1"
                >
                  View all <ArrowUpRight className="w-3 h-3" />
                </Link>
              }
            >
              {data.recentLeads.length === 0 ? (
                <EmptyState
                  title="No leads yet"
                  description="Quote requests submitted from the website's contact form and quote pop-up land here."
                />
              ) : (
                <ul className="divide-y divide-neutral-800">
                  {data.recentLeads.map(lead => (
                    <li key={lead._id} className="flex items-center gap-3 px-5 py-3.5">
                      <span className="w-9 h-9 rounded-lg bg-[#1A1A1A] border border-neutral-800 flex items-center justify-center shrink-0">
                        <FileEdit className="w-4 h-4 text-neutral-600" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-bold text-white truncate">
                          {lead.fullName}
                        </span>
                        <span className="block text-[11px] text-neutral-500 font-mono truncate">
                          {lead.serviceNeeded || '—'} · {formatDate(lead.createdAt)}
                        </span>
                      </span>
                      <Badge tone={LEAD_TONES[lead.status] ?? 'neutral'}>{lead.status}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
