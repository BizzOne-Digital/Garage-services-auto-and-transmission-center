import React from 'react';
import type { TrustPillarDTO } from '../../lib/content-types';
import { adminApi } from '../api';
import { CollectionPage } from '../components/CollectionPage';
import { emptyLocalized, LocalizedInput } from '../components/fields';
import { Badge, FieldError, Input, Label, Select, Toggle } from '../components/ui';

/** Icons the public TrustBar knows how to render. */
const ICON_OPTIONS = ['ShieldCheck', 'BadgeDollarSign', 'Cog', 'HeartHandshake'];

type Draft = Pick<
  TrustPillarDTO,
  'key' | 'iconName' | 'title' | 'subtitle' | 'description' | 'published' | 'order'
>;

export const TrustPillarsPage: React.FC = () => (
  <CollectionPage<TrustPillarDTO, Draft>
    title="Trust pillars"
    singular="Trust pillar"
    description="The four value pillars under the hero section"
    searchPlaceholder="Search pillars…"
    emptyDescription="Trust pillars are the value propositions displayed directly below the hero."
    resource={adminApi.trustPillars}
    describeItem={item => item.title?.fr || item.key}
    blankDraft={() => ({
      key: '',
      iconName: 'ShieldCheck',
      title: emptyLocalized(),
      subtitle: emptyLocalized(),
      description: emptyLocalized(),
      published: true,
      order: 0,
    })}
    toDraft={item => ({
      key: item.key,
      iconName: item.iconName,
      title: item.title ?? emptyLocalized(),
      subtitle: item.subtitle ?? emptyLocalized(),
      description: item.description ?? emptyLocalized(),
      published: item.published,
      order: item.order,
    })}
    columns={[
      {
        header: 'Pillar',
        render: item => (
          <div>
            <span className="block text-xs font-bold text-white">{item.title?.fr || item.key}</span>
            <span className="block text-[11px] text-neutral-500">{item.subtitle?.fr}</span>
          </div>
        ),
      },
      {
        header: 'Icon',
        render: item => (
          <span className="text-[11px] font-mono text-neutral-500">{item.iconName}</span>
        ),
      },
      {
        header: 'Order',
        render: item => <span className="text-[11px] font-mono text-neutral-500">{item.order}</span>,
      },
      {
        header: 'Status',
        render: item => (
          <Badge tone={item.published ? 'green' : 'neutral'}>
            {item.published ? 'Published' : 'Hidden'}
          </Badge>
        ),
      },
    ]}
    renderForm={(draft, set, fields) => (
      <>
        <LocalizedInput
          label="Title"
          value={draft.title}
          onChange={value => set('title', value)}
          error={fields['title']}
        />
        <LocalizedInput
          label="Subtitle"
          value={draft.subtitle}
          onChange={value => set('subtitle', value)}
        />
        <LocalizedInput
          label="Description"
          value={draft.description}
          onChange={value => set('description', value)}
          multiline
          rows={3}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="pillar-key" hint="lowercase, no spaces">
              Key
            </Label>
            <Input
              id="pillar-key"
              value={draft.key}
              error={fields['key']}
              onChange={event => set('key', event.target.value)}
              placeholder="professional"
            />
            <FieldError message={fields['key']} />
          </div>
          <div>
            <Label htmlFor="pillar-icon">Icon</Label>
            <Select
              id="pillar-icon"
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
        </div>
        <div>
          <Label htmlFor="pillar-order" hint="lower shows first">
            Sort position
          </Label>
          <Input
            id="pillar-order"
            type="number"
            value={draft.order}
            onChange={event => set('order', Number(event.target.value))}
          />
        </div>
        <Toggle
          checked={draft.published}
          onChange={value => set('published', value)}
          label="Published"
          description="Visible on the website"
        />
      </>
    )}
  />
);
