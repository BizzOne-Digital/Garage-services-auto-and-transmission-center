import React from 'react';
import type { FaqDTO } from '../../lib/content-types';
import { adminApi } from '../api';
import { CollectionPage } from '../components/CollectionPage';
import { emptyLocalized, LocalizedInput } from '../components/fields';
import { Badge, Input, Label, Toggle } from '../components/ui';

type Draft = Pick<FaqDTO, 'question' | 'answer' | 'published' | 'order'>;

export const FaqsPage: React.FC = () => (
  <CollectionPage<FaqDTO, Draft>
    title="FAQs"
    singular="FAQ"
    description="Pricing and service questions shown in the pricing section"
    searchPlaceholder="Search questions…"
    emptyDescription="FAQs are listed under the pricing cards on the public website."
    resource={adminApi.faqs}
    describeItem={item => item.question?.fr || item.question?.en || 'FAQ'}
    blankDraft={() => ({
      question: emptyLocalized(),
      answer: emptyLocalized(),
      published: true,
      order: 0,
    })}
    toDraft={item => ({
      question: item.question ?? emptyLocalized(),
      answer: item.answer ?? emptyLocalized(),
      published: item.published,
      order: item.order,
    })}
    columns={[
      {
        header: 'Question',
        className: 'max-w-sm',
        render: item => (
          <div>
            <span className="block text-xs font-bold text-white">{item.question?.fr}</span>
            <span className="block text-[11px] text-neutral-500 mt-0.5">{item.question?.en}</span>
          </div>
        ),
      },
      {
        header: 'Answer',
        className: 'max-w-md',
        render: item => (
          <p className="text-[11px] text-neutral-400 leading-relaxed line-clamp-2">
            {item.answer?.fr || item.answer?.en}
          </p>
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
          label="Question"
          value={draft.question}
          onChange={value => set('question', value)}
          multiline
          rows={2}
          error={fields['question']}
        />
        <LocalizedInput
          label="Answer"
          value={draft.answer}
          onChange={value => set('answer', value)}
          multiline
          rows={6}
        />
        <div>
          <Label htmlFor="faq-order" hint="lower shows first">
            Sort position
          </Label>
          <Input
            id="faq-order"
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
