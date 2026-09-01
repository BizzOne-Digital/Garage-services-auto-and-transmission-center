import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { Localized, LocalizedList } from '../../lib/content-types';
import { Button, FieldError, Input, Label, Textarea } from './ui';

/**
 * The site ships in French and English, so every editable string is captured
 * for both languages side by side. French is first because it is the site default.
 */

const LANGS: { code: keyof Localized; label: string }[] = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
];

export const LocalizedInput: React.FC<{
  label: string;
  value: Localized;
  onChange: (next: Localized) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
  multiline?: boolean;
  rows?: number;
}> = ({ label, value, onChange, placeholder, hint, error, multiline, rows = 4 }) => (
  <div>
    <Label hint={hint}>{label}</Label>
    <div className="grid gap-2 sm:grid-cols-2">
      {LANGS.map(lang => {
        const control = multiline ? (
          <Textarea
            rows={rows}
            value={value?.[lang.code] ?? ''}
            error={error}
            placeholder={placeholder}
            onChange={event => onChange({ ...value, [lang.code]: event.target.value })}
          />
        ) : (
          <Input
            value={value?.[lang.code] ?? ''}
            error={error}
            placeholder={placeholder}
            onChange={event => onChange({ ...value, [lang.code]: event.target.value })}
          />
        );
        return (
          <div key={lang.code}>
            <span className="block text-[10px] font-mono uppercase tracking-widest text-neutral-600 mb-1">
              {lang.label}
            </span>
            {control}
          </div>
        );
      })}
    </div>
    <FieldError message={error} />
  </div>
);

/** Bilingual list editor — one line per bullet, per language. */
export const LocalizedListInput: React.FC<{
  label: string;
  value: LocalizedList;
  onChange: (next: LocalizedList) => void;
  hint?: string;
}> = ({ label, value, onChange, hint }) => {
  const update = (code: keyof LocalizedList, index: number, next: string) => {
    const list = [...(value?.[code] ?? [])];
    list[index] = next;
    onChange({ ...value, [code]: list });
  };

  const add = (code: keyof LocalizedList) =>
    onChange({ ...value, [code]: [...(value?.[code] ?? []), ''] });

  const remove = (code: keyof LocalizedList, index: number) =>
    onChange({ ...value, [code]: (value?.[code] ?? []).filter((_, i) => i !== index) });

  return (
    <div>
      <Label hint={hint}>{label}</Label>
      <div className="grid gap-3 sm:grid-cols-2">
        {LANGS.map(lang => {
          const code = lang.code as keyof LocalizedList;
          const list = value?.[code] ?? [];
          return (
            <div key={lang.code} className="rounded-xl border border-neutral-800 bg-[#0F0F0F] p-3">
              <span className="block text-[10px] font-mono uppercase tracking-widest text-neutral-600 mb-2">
                {lang.label}
              </span>
              <div className="space-y-2">
                {list.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={entry}
                      onChange={event => update(code, index, event.target.value)}
                      className="!bg-[#141414]"
                    />
                    <button
                      type="button"
                      onClick={() => remove(code, index)}
                      aria-label={`Remove item ${index + 1}`}
                      className="p-2 rounded-lg text-neutral-600 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {list.length === 0 && (
                  <p className="text-[11px] text-neutral-600 py-1">No items yet.</p>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => add(code)}
                className="mt-2 !px-0"
              >
                <Plus className="w-3.5 h-3.5" />
                Add item
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const emptyLocalized = (): Localized => ({ fr: '', en: '' });
export const emptyLocalizedList = (): LocalizedList => ({ fr: [], en: [] });
