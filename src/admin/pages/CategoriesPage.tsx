import React from 'react';
import type { CategoryDTO } from '../../lib/content-types';
import { adminApi } from '../api';
import { CollectionPage } from '../components/CollectionPage';
import { emptyLocalized, LocalizedInput } from '../components/fields';
import { Badge, FieldError, Input, Label, Toggle } from '../components/ui';

type Draft = Pick<CategoryDTO, 'key' | 'label' | 'order' | 'published'>;

export const CategoriesPage: React.FC = () => (
  <CollectionPage<CategoryDTO, Draft>
    title="Categories"
    singular="Category"
    description="Filter tabs above the services grid"
    searchPlaceholder="Search categories…"
    emptyDescription="Categories group your services into the filter tabs shown on the website."
    resource={adminApi.categories}
    wideForm={false}
    describeItem={item => item.label?.fr || item.key}
    blankDraft={() => ({ key: '', label: emptyLocalized(), order: 0, published: true })}
    toDraft={item => ({
      key: item.key,
      label: item.label ?? emptyLocalized(),
      order: item.order,
      published: item.published,
    })}
    columns={[
      {
        header: 'Category',
        render: item => (
          <div>
            <span className="block text-xs font-bold text-white">{item.label?.fr || item.key}</span>
            <span className="block text-[11px] text-neutral-500">{item.label?.en}</span>
          </div>
        ),
      },
      {
        header: 'Key',
        render: item => <span className="text-[11px] font-mono text-neutral-500">{item.key}</span>,
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
          label="Label"
          value={draft.label}
          onChange={value => set('label', value)}
          placeholder="Transmission"
          error={fields['label']}
        />
        <div>
          <Label htmlFor="category-key" hint="lowercase, no spaces">
            Key
          </Label>
          <Input
            id="category-key"
            value={draft.key}
            error={fields['key']}
            onChange={event => set('key', event.target.value)}
            placeholder="transmission"
          />
          <FieldError message={fields['key']} />
          <p className="text-[11px] text-neutral-600 mt-1.5">
            Services reference this key. Changing it on an existing category will orphan its services.
          </p>
        </div>
        <div>
          <Label htmlFor="category-order" hint="lower shows first">
            Sort position
          </Label>
          <Input
            id="category-order"
            type="number"
            value={draft.order}
            onChange={event => set('order', Number(event.target.value))}
          />
        </div>
        <Toggle
          checked={draft.published}
          onChange={value => set('published', value)}
          label="Published"
          description="Shown as a filter tab on the website"
        />
      </>
    )}
  />
);
