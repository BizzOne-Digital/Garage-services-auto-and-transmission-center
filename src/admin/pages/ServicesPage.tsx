import React, { useState } from 'react';
import { Eye, Pencil, Plus, Search, Trash2, Wrench } from 'lucide-react';
import type { CategoryDTO, ServiceDTO } from '../../lib/content-types';
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
  Pagination,
  Panel,
  Select,
  Spinner,
} from '../components/ui';
import { useAsyncData, useDebounced, useResourceList } from '../hooks';
import { useToast } from '../ToastContext';

const formatDate = (value: string): string =>
  new Date(value).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });

export const ServicesPage: React.FC = () => {
  const toast = useToast();
  const { markSignedOut } = useAuth();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [published, setPublished] = useState('all');
  const [pendingDelete, setPendingDelete] = useState<ServiceDTO | null>(null);
  const [deleting, setDeleting] = useState(false);

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
                          <a
                            href={`/#services`}
                            title="View on website"
                            aria-label={`View ${service.slug} on the website`}
                            className="p-2 rounded-lg text-neutral-500 hover:text-[#F5C400] hover:bg-[#1A1A1A] transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </a>
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
