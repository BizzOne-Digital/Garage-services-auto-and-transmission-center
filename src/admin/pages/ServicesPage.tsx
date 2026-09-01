import React, { useState } from 'react';
import { Eye, Pencil, Plus, Search, Trash2, Wrench } from 'lucide-react';
import type { CategoryDTO, Localized, LocalizedList, ServiceDTO } from '../../lib/content-types';
import { Link } from '../../lib/router';
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
  Modal,
  Pagination,
  Panel,
  Select,
  Spinner,
} from '../components/ui';
import { useAsyncData, useDebounced, useResourceList } from '../hooks';
import { useToast } from '../ToastContext';

const formatDate = (value: string): string =>
  new Date(value).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });

/** Read-only FR/EN pair shown in the service preview dialog. */
const PreviewField: React.FC<{ label: string; value?: Localized }> = ({ label, value }) => {
  if (!value?.fr && !value?.en) return null;
  return (
    <div>
      <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-600 mb-1.5">
        {label}
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {(['fr', 'en'] as const).map(lang => (
          <div key={lang} className="rounded-xl bg-[#0F0F0F] border border-neutral-800 p-3">
            <span className="block text-[10px] font-mono uppercase tracking-widest text-neutral-700 mb-1">
              {lang === 'fr' ? 'Français' : 'English'}
            </span>
            <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-wrap">
              {value[lang] || '—'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const PreviewList: React.FC<{ label: string; value?: LocalizedList }> = ({ label, value }) => {
  if (!value?.fr?.length && !value?.en?.length) return null;
  return (
    <div>
      <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-600 mb-1.5">
        {label}
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {(['fr', 'en'] as const).map(lang => (
          <div key={lang} className="rounded-xl bg-[#0F0F0F] border border-neutral-800 p-3">
            <span className="block text-[10px] font-mono uppercase tracking-widest text-neutral-700 mb-1.5">
              {lang === 'fr' ? 'Français' : 'English'}
            </span>
            <ul className="space-y-1">
              {(value[lang] ?? []).map((entry, index) => (
                <li key={index} className="flex gap-2 text-xs text-neutral-300 leading-relaxed">
                  <span className="text-[#F5C400] shrink-0">·</span>
                  <span>{entry}</span>
                </li>
              ))}
              {(value[lang] ?? []).length === 0 && (
                <li className="text-xs text-neutral-600">—</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ServicesPage: React.FC = () => {
  const toast = useToast();
  const { markSignedOut } = useAuth();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [published, setPublished] = useState('all');
  const [pendingDelete, setPendingDelete] = useState<ServiceDTO | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [preview, setPreview] = useState<ServiceDTO | null>(null);

  const debouncedSearch = useDebounced(search);

  const list = useResourceList<ServiceDTO>(
    query => adminApi.services.list(query),
    { page, pageSize: 20, search: debouncedSearch, categoryKey: category, published }
  );

  const categories = useAsyncData<CategoryDTO[]>(async () => {
    const result = await adminApi.categories.list({ pageSize: 100 });
    return result.items;
  });

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await adminApi.services.remove(pendingDelete._id);
      toast.success(`"${pendingDelete.title?.fr || pendingDelete.slug}" was deleted.`);
      setPendingDelete(null);
      list.reload();
    } catch (error) {
      toast.error(describeError(error, markSignedOut));
    } finally {
      setDeleting(false);
    }
  };

  const resetPageAnd = (action: () => void) => {
    setPage(1);
    action();
  };

  return (
    <AdminLayout
      title="Services"
      description="The services shown on the public website"
      actions={
        <Link to="/admin/services/create">
          <Button size="sm">
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New service</span>
          </Button>
        </Link>
      }
    >
      <Panel>
        <div className="flex flex-col sm:flex-row gap-3 px-5 py-4 border-b border-neutral-800">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 pointer-events-none" />
            <Input
              value={search}
              onChange={event => resetPageAnd(() => setSearch(event.target.value))}
              placeholder="Search by name or slug…"
              className="pl-10"
              aria-label="Search services"
            />
          </div>
          <Select
            value={category}
            onChange={event => resetPageAnd(() => setCategory(event.target.value))}
            aria-label="Filter by category"
            className="sm:w-48"
          >
            <option value="all">All categories</option>
            {(categories.data ?? []).map(item => (
              <option key={item._id} value={item.key}>
                {item.label?.fr || item.key}
              </option>
            ))}
          </Select>
          <Select
            value={published}
            onChange={event => resetPageAnd(() => setPublished(event.target.value))}
            aria-label="Filter by status"
            className="sm:w-40"
          >
            <option value="all">All statuses</option>
            <option value="true">Published</option>
            <option value="false">Draft</option>
          </Select>
        </div>

        {list.loading && <Spinner label="Loading services" />}
        {!list.loading && list.error && <ErrorState message={list.error} onRetry={list.reload} />}

        {!list.loading && !list.error && list.items.length === 0 && (
          <EmptyState
            title={debouncedSearch ? 'No matching services' : 'No services yet'}
            description={
              debouncedSearch
                ? 'Try a different search term or clear the filters.'
                : 'Create your first service, or run `npm run seed` to import the six services currently on the website.'
            }
            action={
              <Link to="/admin/services/create">
                <Button size="sm">Create service</Button>
              </Link>
            }
          />
        )}

        {!list.loading && !list.error && list.items.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[46rem] text-left">
                <thead>
                  <tr className="border-b border-neutral-800">
                    {['Service', 'Category', 'Status', 'Created', ''].map((heading, index) => (
                      <th
                        key={heading || index}
                        className="px-5 py-3 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-600"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {list.items.map(service => (
                    <tr key={service._id} className="hover:bg-[#161616] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="w-10 h-10 rounded-lg bg-[#1A1A1A] border border-neutral-800 flex items-center justify-center overflow-hidden shrink-0">
                            {service.imageUrl ? (
                              <img
                                src={service.imageUrl}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Wrench className="w-4 h-4 text-neutral-600" />
                            )}
                          </span>
                          <span className="min-w-0">
                            <span className="block text-xs font-bold text-white truncate max-w-[16rem]">
                              {service.title?.fr || service.title?.en || service.slug}
                            </span>
                            <span className="block text-[11px] font-mono text-neutral-600 truncate">
                              /{service.slug}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge>{service.categoryKey}</Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Badge tone={service.published ? 'green' : 'neutral'}>
                            {service.published ? 'Published' : 'Draft'}
                          </Badge>
                          {service.featured && <Badge tone="yellow">Featured</Badge>}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[11px] font-mono text-neutral-500 whitespace-nowrap">
                        {formatDate(service.createdAt)}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setPreview(service)}
                            title="View details"
                            aria-label={`View ${service.slug}`}
                            className="p-2 rounded-lg text-neutral-500 hover:text-[#F5C400] hover:bg-[#1A1A1A] transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <Link
                            to={`/admin/services/${service._id}/edit`}
                            title="Edit"
                            aria-label={`Edit ${service.slug}`}
                            className="p-2 rounded-lg text-neutral-500 hover:text-white hover:bg-[#1A1A1A] transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setPendingDelete(service)}
                            title="Delete"
                            aria-label={`Delete ${service.slug}`}
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
        open={Boolean(preview)}
        wide
        title={preview ? preview.title?.fr || preview.title?.en || preview.slug : 'Service'}
        onClose={() => setPreview(null)}
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setPreview(null)}>
              Close
            </Button>
            {preview && (
              <Link to={`/admin/services/${preview._id}/edit`}>
                <Button size="sm">
                  <Pencil className="w-3.5 h-3.5" />
                  Edit service
                </Button>
              </Link>
            )}
          </>
        }
      >
        {preview && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge tone={preview.published ? 'green' : 'neutral'}>
                {preview.published ? 'Published' : 'Draft'}
              </Badge>
              {preview.featured && <Badge tone="yellow">Featured</Badge>}
              <Badge>{preview.categoryKey}</Badge>
              <span className="text-[11px] font-mono text-neutral-600">/{preview.slug}</span>
            </div>

            {preview.imageUrl && (
              <img
                src={preview.imageUrl}
                alt=""
                className="w-full h-48 object-cover rounded-xl border border-neutral-800"
              />
            )}

            <PreviewField label="Title" value={preview.title} />
            <PreviewField label="Short description" value={preview.shortDesc} />
            <PreviewField label="Full description" value={preview.fullDesc} />
            <PreviewList label="Scope of work" value={preview.features} />
            <PreviewList label="Common symptoms" value={preview.commonSymptoms} />
            <PreviewField label="Turnaround time" value={preview.turnaroundTime} />
            <PreviewField label="Ideal for" value={preview.idealFor} />

            {preview.videoUrl && (
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-600 mb-1.5">
                  Video
                </p>
                <a
                  href={preview.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#F5C400] hover:underline break-all"
                >
                  {preview.videoUrl}
                </a>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete service"
        message={`"${pendingDelete?.title?.fr || pendingDelete?.slug || ''}" will be permanently removed from the database and will disappear from the website. This cannot be undone.`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </AdminLayout>
  );
};
