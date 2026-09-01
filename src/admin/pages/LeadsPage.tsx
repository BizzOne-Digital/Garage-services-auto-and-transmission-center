import React, { useState } from 'react';
import { Mail, Phone, Search, Trash2 } from 'lucide-react';
import type { LeadDTO, LeadStatus } from '../../lib/content-types';
import { adminApi } from '../api';
import { describeError, useAuth } from '../AuthContext';
import { AdminLayout } from '../components/AdminLayout';
import {
  Badge,
  Button,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  Input,
  Label,
  Modal,
  Pagination,
  Panel,
  Select,
  Spinner,
  Textarea,
} from '../components/ui';
import { useDebounced, useResourceList } from '../hooks';
import { useToast } from '../ToastContext';

const STATUSES: LeadStatus[] = ['new', 'contacted', 'quoted', 'won', 'lost'];

const STATUS_TONES: Record<LeadStatus, 'yellow' | 'green' | 'neutral' | 'red' | 'blue'> = {
  new: 'yellow',
  contacted: 'blue',
  quoted: 'blue',
  won: 'green',
  lost: 'red',
};

const formatDateTime = (value: string): string =>
  new Date(value).toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const LeadsPage: React.FC = () => {
  const toast = useToast();
  const { markSignedOut } = useAuth();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const debouncedSearch = useDebounced(search);

  const [openLead, setOpenLead] = useState<LeadDTO | null>(null);
  const [draftStatus, setDraftStatus] = useState<LeadStatus>('new');
  const [draftNotes, setDraftNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<LeadDTO | null>(null);
  const [deleting, setDeleting] = useState(false);

  const list = useResourceList<LeadDTO>(query => adminApi.leads.list(query), {
    page,
    pageSize: 20,
    search: debouncedSearch,
    status,
  });

  const openDetail = (lead: LeadDTO) => {
    setOpenLead(lead);
    setDraftStatus(lead.status);
    setDraftNotes(lead.notes ?? '');
  };

  const saveLead = async () => {
    if (!openLead) return;
    setSaving(true);
    try {
      await adminApi.leads.update(openLead._id, { status: draftStatus, notes: draftNotes });
      toast.success('Lead updated.');
      setOpenLead(null);
      list.reload();
    } catch (error) {
      toast.error(describeError(error, markSignedOut));
    } finally {
      setSaving(false);
    }
  };

  const deleteLead = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await adminApi.leads.remove(pendingDelete._id);
      toast.success('Lead deleted.');
      setPendingDelete(null);
      setOpenLead(null);
      list.reload();
    } catch (error) {
      toast.error(describeError(error, markSignedOut));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout
      title="Leads"
      description="Quote requests submitted from the contact form and quote pop-up"
    >
      <Panel>
        <div className="flex flex-col sm:flex-row gap-3 px-5 py-4 border-b border-neutral-800">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 pointer-events-none" />
            <Input
              value={search}
              onChange={event => {
                setPage(1);
                setSearch(event.target.value);
              }}
              placeholder="Search by name, email, phone or vehicle…"
              aria-label="Search leads"
              className="pl-10"
            />
          </div>
          <Select
            value={status}
            onChange={event => {
              setPage(1);
              setStatus(event.target.value);
            }}
            aria-label="Filter by status"
            className="sm:w-44"
          >
            <option value="all">All statuses</option>
            {STATUSES.map(value => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Select>
        </div>

        {list.loading && <Spinner label="Loading leads" />}
        {!list.loading && list.error && <ErrorState message={list.error} onRetry={list.reload} />}

        {!list.loading && !list.error && list.items.length === 0 && (
          <EmptyState
            title={debouncedSearch || status !== 'all' ? 'No matching leads' : 'No leads yet'}
            description="Every quote request submitted on the website is stored here, so nothing gets lost in WhatsApp or email."
          />
        )}

        {!list.loading && !list.error && list.items.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[48rem] text-left">
                <thead>
                  <tr className="border-b border-neutral-800">
                    {['Customer', 'Vehicle', 'Service', 'Received', 'Status', ''].map(
                      (heading, index) => (
                        <th
                          key={heading || index}
                          className="px-5 py-3 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-600"
                        >
                          {heading}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {list.items.map(lead => (
                    <tr
                      key={lead._id}
                      onClick={() => openDetail(lead)}
                      className="hover:bg-[#161616] transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-3.5">
                        <span className="block text-xs font-bold text-white">{lead.fullName}</span>
                        <span className="block text-[11px] font-mono text-neutral-500 truncate max-w-[14rem]">
                          {lead.email}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[11px] text-neutral-400">
                        {[lead.vehicleYear, lead.vehicleMakeModel].filter(Boolean).join(' ') || '—'}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[11px] font-mono text-neutral-400">
                          {lead.serviceNeeded || '—'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[11px] font-mono text-neutral-500 whitespace-nowrap">
                        {formatDateTime(lead.createdAt)}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge tone={STATUS_TONES[lead.status] ?? 'neutral'}>{lead.status}</Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={event => {
                              event.stopPropagation();
                              setPendingDelete(lead);
                            }}
                            aria-label={`Delete lead from ${lead.fullName}`}
                            className="p-2 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={list.page} pages={list.pages} total={list.total} onChange={setPage} />
          </>
        )}
      </Panel>

      <Modal
        open={Boolean(openLead)}
        wide
        title={openLead ? `Lead — ${openLead.fullName}` : 'Lead'}
        onClose={() => setOpenLead(null)}
        footer={
          <>
            <Button
              variant="danger"
              size="sm"
              onClick={() => openLead && setPendingDelete(openLead)}
              disabled={saving}
            >
              Delete
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setOpenLead(null)} disabled={saving}>
              Close
            </Button>
            <Button size="sm" onClick={saveLead} loading={saving}>
              Save
            </Button>
          </>
        }
      >
        {openLead && (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href={`tel:${openLead.phone.replace(/\D/g, '')}`}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0F0F0F] border border-neutral-800 hover:border-[#F5C400]/40 transition-colors group"
              >
                <Phone className="w-4 h-4 text-[#F5C400] shrink-0" />
                <span className="min-w-0">
                  <span className="block text-[10px] font-mono uppercase tracking-widest text-neutral-600">
                    Phone
                  </span>
                  <span className="block text-xs font-bold text-white group-hover:text-[#F5C400] truncate">
                    {openLead.phone}
                  </span>
                </span>
              </a>
              <a
                href={`mailto:${openLead.email}`}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0F0F0F] border border-neutral-800 hover:border-[#F5C400]/40 transition-colors group"
              >
                <Mail className="w-4 h-4 text-[#F5C400] shrink-0" />
                <span className="min-w-0">
                  <span className="block text-[10px] font-mono uppercase tracking-widest text-neutral-600">
                    Email
                  </span>
                  <span className="block text-xs font-bold text-white group-hover:text-[#F5C400] truncate">
                    {openLead.email}
                  </span>
                </span>
              </a>
            </div>

            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2 text-xs">
              {[
                ['Vehicle', [openLead.vehicleYear, openLead.vehicleMakeModel].filter(Boolean).join(' ')],
                ['Service needed', openLead.serviceNeeded],
                ['Transmission', openLead.transmissionType],
                ['Urgency', openLead.urgency],
                ['Source', openLead.source],
                ['Language', openLead.language.toUpperCase()],
                ['Received', formatDateTime(openLead.createdAt)],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[10px] font-mono uppercase tracking-widest text-neutral-600">
                    {label}
                  </dt>
                  <dd className="text-neutral-200 mt-0.5">{value || '—'}</dd>
                </div>
              ))}
            </dl>

            {openLead.message && (
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-600 mb-1.5">
                  Message
                </p>
                <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-wrap rounded-xl bg-[#0F0F0F] border border-neutral-800 p-4">
                  {openLead.message}
                </p>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="lead-status">Status</Label>
                <Select
                  id="lead-status"
                  value={draftStatus}
                  onChange={event => setDraftStatus(event.target.value as LeadStatus)}
                >
                  {STATUSES.map(value => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="lead-notes" hint="internal only">
                Notes
              </Label>
              <Textarea
                id="lead-notes"
                rows={4}
                value={draftNotes}
                onChange={event => setDraftNotes(event.target.value)}
                placeholder="Call outcome, quoted amount, follow-up date…"
              />
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete lead"
        message={`The quote request from "${pendingDelete?.fullName ?? ''}" will be permanently deleted. This cannot be undone.`}
        loading={deleting}
        onConfirm={deleteLead}
        onCancel={() => setPendingDelete(null)}
      />
    </AdminLayout>
  );
};
