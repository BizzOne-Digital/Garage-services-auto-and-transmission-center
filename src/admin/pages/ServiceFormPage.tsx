import React, { useEffect, useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { ApiError } from '../../lib/api';
import type { CategoryDTO, ServiceDTO } from '../../lib/content-types';
import { Link, navigate } from '../../lib/router';
import { adminApi } from '../api';
import { describeError, useAuth } from '../AuthContext';
import { AdminLayout } from '../components/AdminLayout';
import { emptyLocalized, emptyLocalizedList, LocalizedInput, LocalizedListInput } from '../components/fields';
import {
  Button,
  ErrorState,
  FieldError,
  Input,
  Label,
  Panel,
  Select,
  Spinner,
  Toggle,
} from '../components/ui';
import { useAsyncData } from '../hooks';
import { useToast } from '../ToastContext';

/** Icons the public Services section knows how to render. */
const ICON_OPTIONS = ['Wrench', 'Cpu', 'Activity', 'Disc', 'Flame', 'CheckCircle2'];

type ServiceDraft = Omit<ServiceDTO, '_id' | 'createdAt' | 'updatedAt'>;

const blankDraft = (): ServiceDraft => ({
  slug: '',
  categoryKey: 'mechanical',
  iconName: 'Wrench',
  imageUrl: '',
  videoUrl: '',
  featured: false,
  published: true,
  order: 0,
  title: emptyLocalized(),
  shortDesc: emptyLocalized(),
  fullDesc: emptyLocalized(),
  features: emptyLocalizedList(),
  commonSymptoms: emptyLocalizedList(),
  turnaroundTime: emptyLocalized(),
  idealFor: emptyLocalized(),
});

export const ServiceFormPage: React.FC<{ serviceId?: string }> = ({ serviceId }) => {
  const isEdit = Boolean(serviceId);
  const toast = useToast();
  const { markSignedOut } = useAuth();

  const [draft, setDraft] = useState<ServiceDraft>(blankDraft);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const existing = useAsyncData<ServiceDTO | null>(
    () => (serviceId ? adminApi.services.get(serviceId) : Promise.resolve(null)),
    [serviceId]
  );

  const categories = useAsyncData<CategoryDTO[]>(async () => {
    const result = await adminApi.categories.list({ pageSize: 100 });
    return result.items;
  });

  useEffect(() => {
    if (!existing.data) return;
    const { _id, createdAt, updatedAt, ...rest } = existing.data;
    void _id;
    void createdAt;
    void updatedAt;
    setDraft({ ...blankDraft(), ...rest });
  }, [existing.data]);

  const set = <K extends keyof ServiceDraft>(key: K, value: ServiceDraft[K]) =>
    setDraft(current => ({ ...current, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setFields({});

    try {
      if (isEdit && serviceId) {
        await adminApi.services.update(serviceId, draft);
        toast.success('Service updated. The website will show the change immediately.');
      } else {
        const created = await adminApi.services.create(draft);
        toast.success('Service created.');
        navigate(`/admin/services/${created._id}/edit`, { replace: true });
      }
    } catch (error) {
      if (error instanceof ApiError && Object.keys(error.fields).length) setFields(error.fields);
      toast.error(describeError(error, markSignedOut));
    } finally {
      setSaving(false);
    }
  };

  const title = isEdit ? 'Edit service' : 'New service';

  if (isEdit && existing.loading) {
    return (
      <AdminLayout title={title}>
        <Spinner label="Loading service" />
      </AdminLayout>
    );
  }

  if (isEdit && existing.error) {
    return (
      <AdminLayout title={title}>
        <ErrorState message={existing.error} onRetry={existing.reload} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={title}
      description={isEdit ? draft.slug : 'Add a service to the public website'}
      actions={
        <Link to="/admin/services">
          <Button variant="secondary" size="sm">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </Button>
        </Link>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="grid gap-4 xl:grid-cols-[1fr_20rem] items-start">
        <div className="space-y-4 min-w-0">
          <Panel title="Content" description="Shown on the services grid and in the detail pop-up">
            <div className="p-5 space-y-5">
              <LocalizedInput
                label="Title"
                value={draft.title}
                onChange={value => set('title', value)}
                error={fields['title']}
                placeholder="Transmission services"
              />
              <LocalizedInput
                label="Short description"
                hint="card teaser"
                value={draft.shortDesc}
                onChange={value => set('shortDesc', value)}
                multiline
                rows={3}
              />
              <LocalizedInput
                label="Full description"
                hint="detail pop-up"
                value={draft.fullDesc}
                onChange={value => set('fullDesc', value)}
                multiline
                rows={6}
              />
              <LocalizedListInput
                label="Scope of work"
                hint="feature bullets"
                value={draft.features}
                onChange={value => set('features', value)}
              />
              <LocalizedListInput
                label="Common symptoms"
                hint="optional"
                value={draft.commonSymptoms}
                onChange={value => set('commonSymptoms', value)}
              />
              <LocalizedInput
                label="Turnaround time"
                hint="optional"
                value={draft.turnaroundTime}
                onChange={value => set('turnaroundTime', value)}
              />
              <LocalizedInput
                label="Ideal for"
                value={draft.idealFor}
                onChange={value => set('idealFor', value)}
              />
            </div>
          </Panel>

          <Panel title="Media" description="Images and video are kept as separate fields">
            <div className="p-5 grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="service-image">Image URL</Label>
                <Input
                  id="service-image"
                  value={draft.imageUrl}
                  error={fields['imageUrl']}
                  onChange={event => set('imageUrl', event.target.value)}
                  placeholder="https://…"
                />
                <FieldError message={fields['imageUrl']} />
                {draft.imageUrl && (
                  <img
                    src={draft.imageUrl}
                    alt=""
                    className="mt-3 w-full h-32 object-cover rounded-xl border border-neutral-800"
                  />
                )}
              </div>
              <div>
                <Label htmlFor="service-video">Video URL</Label>
                <Input
                  id="service-video"
                  value={draft.videoUrl}
                  error={fields['videoUrl']}
                  onChange={event => set('videoUrl', event.target.value)}
                  placeholder="https://…"
                />
                <FieldError message={fields['videoUrl']} />
                <p className="text-[11px] text-neutral-600 mt-2 leading-relaxed">
                  Paste the URL of an externally hosted video.
                </p>
              </div>
            </div>
          </Panel>
        </div>

        <div className="space-y-4 xl:sticky xl:top-20">
          <Panel title="Publishing">
            <div className="p-5 space-y-4">
              <Toggle
                checked={draft.published}
                onChange={value => set('published', value)}
                label="Published"
                description="Visible on the public website"
              />
              <Toggle
                checked={draft.featured}
                onChange={value => set('featured', value)}
                label="Featured"
                description="Marked as a specialty service"
              />
              <Button type="submit" loading={saving} className="w-full">
                <Save className="w-3.5 h-3.5" />
                {isEdit ? 'Save changes' : 'Create service'}
              </Button>
            </div>
          </Panel>

          <Panel title="Organisation">
            <div className="p-5 space-y-4">
              <div>
                <Label htmlFor="service-slug" hint="URL key">
                  Slug
                </Label>
                <Input
                  id="service-slug"
                  value={draft.slug}
                  error={fields['slug']}
                  onChange={event => set('slug', event.target.value)}
                  placeholder="transmission-services"
                />
                <FieldError message={fields['slug']} />
                <p className="text-[11px] text-neutral-600 mt-1.5">
                  Leave blank to generate it from the title.
                </p>
              </div>

              <div>
                <Label htmlFor="service-category">Category</Label>
                <Select
                  id="service-category"
                  value={draft.categoryKey}
                  onChange={event => set('categoryKey', event.target.value)}
                >
                  {(categories.data ?? []).map(category => (
                    <option key={category._id} value={category.key}>
                      {category.label?.fr || category.key}
                    </option>
                  ))}
                  {(categories.data ?? []).every(category => category.key !== draft.categoryKey) && (
                    <option value={draft.categoryKey}>{draft.categoryKey}</option>
                  )}
                </Select>
              </div>

              <div>
                <Label htmlFor="service-icon">Icon</Label>
                <Select
                  id="service-icon"
                  value={draft.iconName}
                  onChange={event => set('iconName', event.target.value)}
                >
                  {ICON_OPTIONS.map(icon => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label htmlFor="service-order" hint="lower shows first">
                  Sort position
                </Label>
                <Input
                  id="service-order"
                  type="number"
                  value={draft.order}
                  onChange={event => set('order', Number(event.target.value))}
                />
              </div>
            </div>
          </Panel>
        </div>
      </form>
    </AdminLayout>
  );
};
