import React, { useRef, useState } from 'react';
import { Check, Copy, Film, Image as ImageIcon, Link2, Search, Trash2, Upload } from 'lucide-react';
import { ApiError } from '../../lib/api';
import type { MediaDTO, MediaKind } from '../../lib/content-types';
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
} from '../components/ui';
import { useAsyncData, useDebounced, useResourceList } from '../hooks';
import { useToast } from '../ToastContext';

/** Cloudinary's base64 upload path is only practical for reasonably small files. */
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

const formatBytes = (bytes: number): string => {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const readAsDataUri = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read the selected file.'));
    reader.readAsDataURL(file);
  });

export const MediaPage: React.FC = () => {
  const toast = useToast();
  const { markSignedOut } = useAuth();
  const fileInput = useRef<HTMLInputElement>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [kind, setKind] = useState<'all' | MediaKind>('all');
  const debouncedSearch = useDebounced(search);

  const [uploading, setUploading] = useState(false);
  const [urlModalOpen, setUrlModalOpen] = useState(false);
  const [urlDraft, setUrlDraft] = useState({ url: '', title: '', kind: 'image' as MediaKind });
  const [savingUrl, setSavingUrl] = useState(false);
  const [urlFields, setUrlFields] = useState<Record<string, string>>({});
  const [pendingDelete, setPendingDelete] = useState<MediaDTO | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const config = useAsyncData(() => adminApi.media.config());
  const uploadsEnabled = config.data?.uploadsEnabled ?? false;

  const list = useResourceList<MediaDTO>(query => adminApi.media.list(query), {
    page,
    pageSize: 24,
    search: debouncedSearch,
    kind,
  });

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error(`"${file.name}" is larger than 8 MB. Upload it to your media host and add it by URL.`);
      return;
    }

    setUploading(true);
    try {
      const dataUri = await readAsDataUri(file);
      // Videos are stored as a separate kind so they never mix with service images.
      const uploadKind: MediaKind = file.type.startsWith('video/') ? 'video' : 'image';
      await adminApi.media.upload({ file: dataUri, kind: uploadKind, title: file.name });
      toast.success(`"${file.name}" uploaded.`);
      setPage(1);
      list.reload();
    } catch (error) {
      toast.error(describeError(error, markSignedOut));
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  const saveUrl = async () => {
    setSavingUrl(true);
    setUrlFields({});
    try {
      await adminApi.media.createFromUrl(urlDraft);
      toast.success('Media added to the library.');
      setUrlModalOpen(false);
      setUrlDraft({ url: '', title: '', kind: 'image' });
      setPage(1);
      list.reload();
    } catch (error) {
      if (error instanceof ApiError && Object.keys(error.fields).length) setUrlFields(error.fields);
      toast.error(describeError(error, markSignedOut));
    } finally {
      setSavingUrl(false);
    }
  };

  const deleteMedia = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await adminApi.media.remove(pendingDelete._id);
      toast.success('Media deleted.');
      setPendingDelete(null);
      list.reload();
    } catch (error) {
      toast.error(describeError(error, markSignedOut));
    } finally {
      setDeleting(false);
    }
  };

  const copyUrl = async (item: MediaDTO) => {
    try {
      await navigator.clipboard.writeText(item.url);
      setCopiedId(item._id);
      window.setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('Could not copy the URL. Select and copy it manually.');
    }
  };

  return (
    <AdminLayout
      title="Media"
      description="Images and videos referenced by the website"
      actions={
        <>
          <Button variant="secondary" size="sm" onClick={() => setUrlModalOpen(true)}>
            <Link2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add by URL</span>
          </Button>
          {uploadsEnabled && (
            <Button size="sm" loading={uploading} onClick={() => fileInput.current?.click()}>
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Upload</span>
            </Button>
          )}
        </>
      }
    >
      <input
        ref={fileInput}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={event => void handleFiles(event.target.files)}
      />

      {!config.loading && !uploadsEnabled && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-[#F5C400]/5 border border-[#F5C400]/30 text-[11px] text-neutral-300 leading-relaxed">
          File uploads are disabled because Cloudinary is not configured. Set{' '}
          <code className="font-mono text-[#F5C400]">CLOUDINARY_CLOUD_NAME</code>,{' '}
          <code className="font-mono text-[#F5C400]">CLOUDINARY_API_KEY</code> and{' '}
          <code className="font-mono text-[#F5C400]">CLOUDINARY_API_SECRET</code> in your{' '}
          <code className="font-mono text-[#F5C400]">.env</code> to enable them. You can still add
          assets by URL.
        </div>
      )}

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
              placeholder="Search media…"
              aria-label="Search media"
              className="pl-10"
            />
          </div>
          <Select
            value={kind}
            onChange={event => {
              setPage(1);
              setKind(event.target.value as 'all' | MediaKind);
            }}
            aria-label="Filter by type"
            className="sm:w-40"
          >
            <option value="all">All types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
          </Select>
        </div>

        {list.loading && <Spinner label="Loading media" />}
        {!list.loading && list.error && <ErrorState message={list.error} onRetry={list.reload} />}

        {!list.loading && !list.error && list.items.length === 0 && (
          <EmptyState
            title={debouncedSearch ? 'No matching media' : 'No media yet'}
            description="Add an image or video, then paste its URL into a service, the hero or the about section."
            action={
              <Button size="sm" onClick={() => setUrlModalOpen(true)}>
                Add by URL
              </Button>
            }
          />
        )}

        {!list.loading && !list.error && list.items.length > 0 && (
          <>
            <ul className="grid gap-4 p-5 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {list.items.map(item => (
                <li
                  key={item._id}
                  className="rounded-xl bg-[#0F0F0F] border border-neutral-800 overflow-hidden group"
                >
                  <div className="aspect-video bg-[#161616] flex items-center justify-center overflow-hidden">
                    {item.kind === 'image' ? (
                      <img
                        src={item.url}
                        alt={item.alt?.fr || item.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Film className="w-8 h-8 text-neutral-700" />
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-[11px] font-bold text-white truncate" title={item.title}>
                      {item.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Badge tone={item.kind === 'video' ? 'blue' : 'neutral'}>
                        {item.kind === 'video' ? (
                          <Film className="w-2.5 h-2.5" />
                        ) : (
                          <ImageIcon className="w-2.5 h-2.5" />
                        )}
                        {item.kind}
                      </Badge>
                      <span className="text-[10px] font-mono text-neutral-600">
                        {formatBytes(item.bytes)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-2.5">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => void copyUrl(item)}
                        className="flex-1"
                      >
                        {copiedId === item._id ? (
                          <>
                            <Check className="w-3 h-3" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy URL
                          </>
                        )}
                      </Button>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(item)}
                        aria-label={`Delete ${item.title}`}
                        className="p-2 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <Pagination page={list.page} pages={list.pages} total={list.total} onChange={setPage} />
          </>
        )}
      </Panel>

      <Modal
        open={urlModalOpen}
        title="Add media by URL"
        onClose={() => setUrlModalOpen(false)}
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setUrlModalOpen(false)}
              disabled={savingUrl}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={saveUrl} loading={savingUrl}>
              Add to library
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="media-url">URL</Label>
            <Input
              id="media-url"
              value={urlDraft.url}
              error={urlFields['url']}
              onChange={event => setUrlDraft({ ...urlDraft, url: event.target.value })}
              placeholder="https://res.cloudinary.com/…"
            />
          </div>
          <div>
            <Label htmlFor="media-title">Title</Label>
            <Input
              id="media-title"
              value={urlDraft.title}
              onChange={event => setUrlDraft({ ...urlDraft, title: event.target.value })}
              placeholder="Hero background"
            />
          </div>
          <div>
            <Label htmlFor="media-kind" hint="videos stay separate from images">
              Type
            </Label>
            <Select
              id="media-kind"
              value={urlDraft.kind}
              onChange={event =>
                setUrlDraft({ ...urlDraft, kind: event.target.value as MediaKind })
              }
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </Select>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete media"
        message={`"${pendingDelete?.title ?? ''}" will be removed from the library${
          pendingDelete?.provider === 'cloudinary' ? ' and from Cloudinary' : ''
        }. Anything on the website still pointing at this URL will show a broken asset.`}
        loading={deleting}
        onConfirm={deleteMedia}
        onCancel={() => setPendingDelete(null)}
      />
    </AdminLayout>
  );
};
