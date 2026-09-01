import React from 'react';
import { AlertTriangle, Inbox, Loader2, X } from 'lucide-react';

/**
 * Admin UI primitives.
 *
 * The palette, typography and shape language are lifted straight from the
 * public site: #0A0A0A ground, #121212/#161616 panels, #F5C400 accent,
 * Space Grotesk uppercase headings and rounded-xl/2xl surfaces.
 */

/* ------------------------------- Button -------------------------------- */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

const BUTTON_STYLES: Record<ButtonVariant, string> = {
  primary:
    'bg-[#F5C400] text-[#0A0A0A] hover:bg-[#E5B700] shadow-lg hover:shadow-[#F5C400]/25 border border-transparent',
  secondary:
    'bg-[#1A1A1A] text-neutral-200 hover:text-white hover:border-neutral-600 border border-neutral-700',
  ghost: 'bg-transparent text-neutral-400 hover:text-[#F5C400] border border-transparent',
  danger: 'bg-red-500/10 text-red-300 hover:bg-red-500/20 border border-red-500/40',
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  children,
  ...rest
}) => (
  <button
    {...rest}
    disabled={disabled || loading}
    className={`inline-flex items-center justify-center gap-2 rounded-xl font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] ${
      size === 'sm' ? 'px-3 py-2 text-[11px]' : 'px-4 py-3 text-xs'
    } ${BUTTON_STYLES[variant]} ${className}`}
  >
    {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
    {children}
  </button>
);

/* -------------------------------- Panel -------------------------------- */

export const Panel: React.FC<{
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}> = ({ title, description, actions, className = '', children }) => (
  <section
    className={`rounded-2xl bg-[#121212] border border-neutral-800 overflow-hidden ${className}`}
  >
    {(title || actions) && (
      <header className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-neutral-800">
        <div>
          {title && (
            <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
              {title}
            </h2>
          )}
          {description && <p className="text-[11px] text-neutral-500 mt-0.5">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </header>
    )}
    {children}
  </section>
);

/* -------------------------------- Fields ------------------------------- */

export const Label: React.FC<{ htmlFor?: string; children: React.ReactNode; hint?: string }> = ({
  htmlFor,
  children,
  hint,
}) => (
  <label
    htmlFor={htmlFor}
    className="block text-[11px] font-bold uppercase tracking-wider text-neutral-300 mb-1.5"
  >
    {children}
    {hint && <span className="ml-2 font-normal normal-case tracking-normal text-neutral-600">{hint}</span>}
  </label>
);

const FIELD_BASE =
  'w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F0F] border text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-[#F5C400]/70 transition-colors';

export const Input: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & { error?: string }
> = ({ error, className = '', ...rest }) => (
  <input
    {...rest}
    className={`${FIELD_BASE} ${error ? 'border-red-500/60' : 'border-neutral-700'} ${className}`}
  />
);

export const Textarea: React.FC<
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }
> = ({ error, className = '', ...rest }) => (
  <textarea
    {...rest}
    className={`${FIELD_BASE} leading-relaxed ${error ? 'border-red-500/60' : 'border-neutral-700'} ${className}`}
  />
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({
  className = '',
  children,
  ...rest
}) => (
  <select {...rest} className={`${FIELD_BASE} border-neutral-700 ${className}`}>
    {children}
  </select>
);

export const FieldError: React.FC<{ message?: string }> = ({ message }) =>
  message ? (
    <p className="flex items-center gap-1.5 text-[11px] text-red-400 mt-1.5">
      <AlertTriangle className="w-3 h-3 shrink-0" />
      {message}
    </p>
  ) : null;

export const Toggle: React.FC<{
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: string;
}> = ({ checked, onChange, label, description }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className="flex items-start gap-3 text-left w-full"
  >
    <span
      className={`mt-0.5 relative w-10 h-5 shrink-0 rounded-full transition-colors ${
        checked ? 'bg-[#F5C400]' : 'bg-neutral-700'
      }`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-[#0A0A0A] transition-all ${
          checked ? 'left-5' : 'left-0.5'
        }`}
      />
    </span>
    <span>
      <span className="block text-xs font-bold uppercase tracking-wider text-neutral-200">{label}</span>
      {description && <span className="block text-[11px] text-neutral-500 mt-0.5">{description}</span>}
    </span>
  </button>
);

/* -------------------------------- Badge -------------------------------- */

export const Badge: React.FC<{
  tone?: 'yellow' | 'green' | 'neutral' | 'red' | 'blue';
  children: React.ReactNode;
}> = ({ tone = 'neutral', children }) => {
  const tones: Record<string, string> = {
    yellow: 'bg-[#F5C400]/10 text-[#F5C400] border-[#F5C400]/30',
    green: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    neutral: 'bg-neutral-800 text-neutral-400 border-neutral-700',
    red: 'bg-red-500/10 text-red-300 border-red-500/30',
    blue: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${tones[tone]}`}
    >
      {children}
    </span>
  );
};

/* ---------------------------- State displays --------------------------- */

export const Spinner: React.FC<{ label?: string }> = ({ label }) => (
  <div className="flex items-center justify-center gap-3 py-16 text-neutral-500">
    <Loader2 className="w-5 h-5 animate-spin text-[#F5C400]" />
    {label && <span className="text-xs uppercase tracking-wider">{label}</span>}
  </div>
);

export const EmptyState: React.FC<{
  title: string;
  description?: string;
  action?: React.ReactNode;
}> = ({ title, description, action }) => (
  <div className="flex flex-col items-center text-center gap-3 py-16 px-6">
    <span className="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-neutral-800 flex items-center justify-center">
      <Inbox className="w-5 h-5 text-neutral-600" />
    </span>
    <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white">{title}</h3>
    {description && <p className="text-xs text-neutral-500 max-w-sm leading-relaxed">{description}</p>}
    {action}
  </div>
);

export const ErrorState: React.FC<{ message: string; onRetry?: () => void }> = ({
  message,
  onRetry,
}) => (
  <div className="flex flex-col items-center text-center gap-3 py-16 px-6">
    <span className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
      <AlertTriangle className="w-5 h-5 text-red-400" />
    </span>
    <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
      Something went wrong
    </h3>
    <p className="text-xs text-neutral-500 max-w-sm leading-relaxed">{message}</p>
    {onRetry && (
      <Button variant="secondary" size="sm" onClick={onRetry}>
        Try again
      </Button>
    )}
  </div>
);

/* -------------------------------- Modal -------------------------------- */

export const Modal: React.FC<{
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
}> = ({ open, title, onClose, children, footer, wide }) => {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} my-8 rounded-2xl bg-[#121212] border border-neutral-700 shadow-2xl`}
      >
        <header className="flex items-center justify-between gap-4 px-5 py-4 border-b border-neutral-800">
          <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </header>
        <div className="px-5 py-5">{children}</div>
        {footer && (
          <footer className="flex items-center justify-end gap-2 px-5 py-4 border-t border-neutral-800">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
};

export const ConfirmDialog: React.FC<{
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ open, title, message, confirmLabel = 'Delete', loading, onConfirm, onCancel }) => (
  <Modal
    open={open}
    title={title}
    onClose={onCancel}
    footer={
      <>
        <Button variant="secondary" size="sm" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button variant="danger" size="sm" onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </>
    }
  >
    <p className="text-sm text-neutral-400 leading-relaxed">{message}</p>
  </Modal>
);

/* ------------------------------ Pagination ----------------------------- */

export const Pagination: React.FC<{
  page: number;
  pages: number;
  total: number;
  onChange: (page: number) => void;
}> = ({ page, pages, total, onChange }) => {
  if (total === 0) return null;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-t border-neutral-800">
      <p className="text-[11px] text-neutral-500 font-mono">
        Page {page} of {pages} · {total} {total === 1 ? 'record' : 'records'}
      </p>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          Previous
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={page >= pages}
          onClick={() => onChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
