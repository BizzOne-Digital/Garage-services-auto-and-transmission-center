import React from 'react';
import { Star } from 'lucide-react';
import type { TestimonialDTO } from '../../lib/content-types';
import { adminApi } from '../api';
import { CollectionPage } from '../components/CollectionPage';
import { emptyLocalized, LocalizedInput } from '../components/fields';
import { Badge, Input, Label, Select, Toggle } from '../components/ui';

type Draft = Pick<
  TestimonialDTO,
  | 'name'
  | 'role'
  | 'vehicle'
  | 'serviceCategory'
  | 'content'
  | 'date'
  | 'rating'
  | 'verified'
  | 'published'
  | 'order'
>;

export const TestimonialsPage: React.FC = () => (
  <CollectionPage<TestimonialDTO, Draft>
    title="Testimonials"
    singular="Testimonial"
    description="Customer and partner-shop reviews shown on the website"
    searchPlaceholder="Search by name or review text…"
    emptyDescription="Testimonials appear in the reputation section of the public site."
    resource={adminApi.testimonials}
    describeItem={item => item.name}
    blankDraft={() => ({
      name: '',
      role: emptyLocalized(),
      vehicle: emptyLocalized(),
      serviceCategory: emptyLocalized(),
      content: emptyLocalized(),
      date: emptyLocalized(),
      rating: 5,
      verified: true,
      published: true,
      order: 0,
    })}
    toDraft={item => ({
      name: item.name,
      role: item.role ?? emptyLocalized(),
      vehicle: item.vehicle ?? emptyLocalized(),
      serviceCategory: item.serviceCategory ?? emptyLocalized(),
      content: item.content ?? emptyLocalized(),
      date: item.date ?? emptyLocalized(),
      rating: item.rating,
      verified: item.verified,
      published: item.published,
      order: item.order,
    })}
    columns={[
      {
        header: 'Customer',
        render: item => (
          <div>
            <span className="block text-xs font-bold text-white">{item.name}</span>
            <span className="block text-[11px] text-neutral-500">{item.role?.fr}</span>
          </div>
        ),
      },
      {
        header: 'Review',
        className: 'max-w-md',
        render: item => (
          <p className="text-[11px] text-neutral-400 leading-relaxed line-clamp-2">
            {item.content?.fr || item.content?.en}
          </p>
        ),
      },
      {
        header: 'Rating',
        render: item => (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#F5C400]">
            <Star className="w-3 h-3 fill-current" />
            {item.rating}
          </span>
        ),
      },
      {
        header: 'Status',
        render: item => (
          <div className="flex flex-wrap gap-1.5">
            <Badge tone={item.published ? 'green' : 'neutral'}>
              {item.published ? 'Published' : 'Hidden'}
            </Badge>
            {item.verified && <Badge tone="yellow">Verified</Badge>}
          </div>
        ),
      },
    ]}
    renderForm={(draft, set, fields) => (
      <>
        <div>
          <Label htmlFor="testimonial-name">Customer name</Label>
          <Input
            id="testimonial-name"
            value={draft.name}
            error={fields['name']}
            onChange={event => set('name', event.target.value)}
            placeholder="Marc L."
          />
        </div>
        <LocalizedInput
          label="Role"
          value={draft.role}
          onChange={value => set('role', value)}
          placeholder="Propriétaire de véhicule"
        />
        <LocalizedInput
          label="Vehicle"
          value={draft.vehicle}
          onChange={value => set('vehicle', value)}
          placeholder="Honda Accord 2018"
        />
        <LocalizedInput
          label="Service category"
          value={draft.serviceCategory}
          onChange={value => set('serviceCategory', value)}
        />
        <LocalizedInput
          label="Review"
          value={draft.content}
          onChange={value => set('content', value)}
          multiline
          rows={5}
        />
        <LocalizedInput
          label="Date label"
          hint="free text, e.g. “Recent customer”"
          value={draft.date}
          onChange={value => set('date', value)}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="testimonial-rating">Rating</Label>
            <Select
              id="testimonial-rating"
              value={draft.rating}
              onChange={event => set('rating', Number(event.target.value))}
            >
              {[5, 4, 3, 2, 1].map(value => (
                <option key={value} value={value}>
                  {value} star{value === 1 ? '' : 's'}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="testimonial-order" hint="lower shows first">
              Sort position
            </Label>
            <Input
              id="testimonial-order"
              type="number"
              value={draft.order}
              onChange={event => set('order', Number(event.target.value))}
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Toggle
            checked={draft.published}
            onChange={value => set('published', value)}
            label="Published"
            description="Visible on the website"
          />
          <Toggle
            checked={draft.verified}
            onChange={value => set('verified', value)}
            label="Verified"
            description="Shows the verified badge"
          />
        </div>
      </>
    )}
  />
);
