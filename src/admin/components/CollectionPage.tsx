import React, { useState } from 'react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { ApiError } from '../../lib/api';
import type { Paginated } from '../../lib/content-types';
import { adminApi } from '../api';
import { describeError, useAuth } from '../AuthContext';
import { AdminLayout } from './AdminLayout';
import {
  Button,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  Input,
  Modal,
  Pagination,
  Panel,
  Spinner,
} from './ui';
import { useDebounced, useResourceList } from '../hooks';
import { useToast } from '../ToastContext';

export interface Column<T> {
  header: string;
  render: (item: T) => React.ReactNode;
  className?: string;
}

interface Resource<T> {
  list: (query: Record<string, string | number | undefined>) => Promise<Paginated<T>>;
  create: (body: Partial<T>) => Promise<T>;
  update: (id: string, body: Partial<T>) => Promise<T>;
  remove: (id: string) => Promise<{ deleted: boolean }>;
}

interface CollectionPageProps<T extends { _id: string }, D> {
  title: string;
  description: string;
  singular: string;
  searchPlaceholder: string;
  emptyDescription: string;
  resource: Resource<T>;
  columns: Column<T>[];
  blankDraft: () => D;
  toDraft: (item: T) => D;
  /** Renders the modal form body. `set` patches a single draft key. */
  renderForm: (
    draft: D,
    set: <K extends keyof D>(key: K, value: D[K]) => void,
    fields: Record<string, string>
  ) => React.ReactNode;
  describeItem: (item: T) => string;
  wideForm?: boolean;
}

/**
 * List + modal editor used by the smaller collections (categories, FAQs,
 * testimonials, trust pillars). Services get their own full-page form because
 * they carry far more fields.
 */
export function CollectionPage<T extends { _id: string }, D>({
  title,
  description,
  singular,
  searchPlaceholder,
  emptyDescription,
  resource,
  columns,
  blankDraft,
  toDraft,
  renderForm,
  describeItem,
  wideForm = true,
}: CollectionPageProps<T, D>) {
  const toast = useToast();
  const { markSignedOut } = useAuth();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounced(search);

  const [editing, setEditing] = useState<{ id: string | null; draft: D } | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<T | null>(null);
  const [deleting, setDeleting] = useState(false);

  const list = useResourceList<T>(query => resource.list(query), {
    page,
    pageSize: 20,
    search: debouncedSearch,
  });

  const openCreate = () => {
    setFields({});
    setEditing({ id: null, draft: blankDraft() });
  };

  const openEdit = (item: T) => {
    setFields({});
    setEditing({ id: item._id, draft: toDraft(item) });
  };

  const set = <K extends keyof D>(key: K, value: D[K]) =>
    setEditing(current => (current ? { ...current, draft: { ...current.draft, [key]: value } } : current));

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    setFields({});
    try {
      if (editing.id) {
        await resource.update(editing.id, editing.draft as Partial<T>);
        toast.success(`${singular} updated.`);
      } else {
        await resource.create(editing.draft as Partial<T>);
        toast.success(`${singular} created.`);
      }
      setEditing(null);
      list.reload();
    } catch (error) {
      if (error instanceof ApiError && Object.keys(error.fields).length) setFields(error.fields);
      toast.error(describeError(error, markSignedOut));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await resource.remove(pendingDelete._id);
      toast.success(`${singular} deleted.`);
      setPendingDelete(null);
      list.reload();
    } catch (error) {
      toast.error(describeError(error, markSignedOut));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout
      title={title}
      description={description}
      actions={
        <Button size="sm" onClick={openCreate}>
          <Plus className="w-3.5 h-3.5" />
          New
        </Button>
      }
    >
      <Panel>
        <div className="px-5 py-4 border-b border-neutral-800">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 pointer-events-none" />
            <Input
              value={search}
              onChange={event => {
                setPage(1);
                setSearch(event.target.value);
              }}
              placeholder={searchPlaceholder}
              aria-label={`Search ${title.toLowerCase()}`}
              className="pl-10"
            />
          </div>
        </div>

        {list.loading && <Spinner label={`Loading ${title.toLowerCase()}`} />}
        {!list.loading && list.error && <ErrorState message={list.error} onRetry={list.reload} />}

        {!list.loading && !list.error && list.items.length === 0 && (
          <EmptyState
            title={debouncedSearch ? 'No matches' : `No ${title.toLowerCase()} yet`}
            description={debouncedSearch ? 'Try a different search term.' : emptyDescription}
            action={
              <Button size="sm" onClick={openCreate}>
                Create {singular.toLowerCase()}
              </Button>
            }
          />
        )}

        {!list.loading && !list.error && list.items.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[40rem] text-left">
                <thead>
                  <tr className="border-b border-neutral-800">
                    {columns.map(column => (
                      <th
                        key={column.header}
                        className="px-5 py-3 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-600"
                      >
                        {column.header}
                      </th>
                    ))}
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {list.items.map(item => (
                    <tr key={item._id} className="hover:bg-[#161616] transition-colors align-top">
                      {columns.map(column => (
                        <td key={column.header} className={`px-5 py-3.5 ${column.className ?? ''}`}>
                          {column.render(item)}
                        </td>
                      ))}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEdit(item)}
                            aria-label={`Edit ${describeItem(item)}`}
                            className="p-2 rounded-lg text-neutral-500 hover:text-white hover:bg-[#1A1A1A] transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setPendingDelete(item)}
                            aria-label={`Delete ${describeItem(item)}`}
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
        open={Boolean(editing)}
        wide={wideForm}
        title={editing?.id ? `Edit ${singular.toLowerCase()}` : `New ${singular.toLowerCase()}`}
        onClose={() => setEditing(null)}
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setEditing(null)} disabled={saving}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} loading={saving}>
              Save
            </Button>
          </>
        }
      >
        {editing && <div className="space-y-5">{renderForm(editing.draft, set, fields)}</div>}
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Delete ${singular.toLowerCase()}`}
        message={`"${pendingDelete ? describeItem(pendingDelete) : ''}" will be permanently removed and will disappear from the website. This cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </AdminLayout>
  );
}

export { adminApi };
