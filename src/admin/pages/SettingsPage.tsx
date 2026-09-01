import React, { useEffect, useState } from 'react';
import { KeyRound, Plus, Save, Trash2 } from 'lucide-react';
import { ApiError } from '../../lib/api';
import type { SettingsDTO } from '../../lib/content-types';
import { adminApi } from '../api';
import { describeError, useAuth } from '../AuthContext';
import { AdminLayout } from '../components/AdminLayout';
import { emptyLocalized, LocalizedInput } from '../components/fields';
import {
  Button,
  ErrorState,
  FieldError,
  Input,
  Label,
  Panel,
  Spinner,
} from '../components/ui';
import { useAsyncData } from '../hooks';
import { useToast } from '../ToastContext';

type Draft = Omit<SettingsDTO, '_id' | 'updatedAt'>;

const blankDraft = (): Draft => ({
  shortName: '',
  businessName: emptyLocalized(),
  contactPerson: '',
  phone: '',
  phoneRaw: '',
  email: '',
  socialMediaName: '',
  socialLinks: [],
  logoUrl: '',
  heroImageUrl: '',
  aboutImageUrl: '',
});

const ImageField: React.FC<{
  id: string;
  label: string;
  hint?: string;
  value: string;
  error?: string;
  onChange: (next: string) => void;
}> = ({ id, label, hint, value, error, onChange }) => (
  <div>
    <Label htmlFor={id} hint={hint}>
      {label}
    </Label>
    <Input
      id={id}
      value={value}
      error={error}
      onChange={event => onChange(event.target.value)}
      placeholder="https://…"
    />
    <FieldError message={error} />
    {value && (
      <img
        src={value}
        alt=""
        className="mt-3 w-full h-28 object-cover rounded-xl border border-neutral-800 bg-[#0F0F0F]"
      />
    )}
  </div>
);

export const SettingsPage: React.FC = () => {
  const toast = useToast();
  const { markSignedOut, admin } = useAuth();

  const settings = useAsyncData<SettingsDTO | null>(() => adminApi.settings.get());
  const [draft, setDraft] = useState<Draft>(blankDraft);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const [passwords, setPasswords] = useState({ currentPassword: '', nextPassword: '' });
  const [passwordFields, setPasswordFields] = useState<Record<string, string>>({});
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (!settings.data) return;
    const { _id, updatedAt, ...rest } = settings.data;
    void _id;
    void updatedAt;
    setDraft({ ...blankDraft(), ...rest });
  }, [settings.data]);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft(current => ({ ...current, [key]: value }));

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setFields({});
    try {
      const saved = await adminApi.settings.save(draft);
      settings.setData(saved);
      toast.success('Settings saved. The website picks them up immediately.');
    } catch (error) {
      if (error instanceof ApiError && Object.keys(error.fields).length) setFields(error.fields);
      toast.error(describeError(error, markSignedOut));
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (event: React.FormEvent) => {
    event.preventDefault();
    setChangingPassword(true);
    setPasswordFields({});
    try {
      await adminApi.auth.changePassword(passwords.currentPassword, passwords.nextPassword);
      setPasswords({ currentPassword: '', nextPassword: '' });
      toast.success('Password updated.');
    } catch (error) {
      if (error instanceof ApiError && Object.keys(error.fields).length) {
        setPasswordFields(error.fields);
      }
      toast.error(describeError(error, markSignedOut));
    } finally {
      setChangingPassword(false);
    }
  };

  if (settings.loading) {
    return (
      <AdminLayout title="Settings">
        <Spinner label="Loading settings" />
      </AdminLayout>
    );
  }

  if (settings.error) {
    return (
      <AdminLayout title="Settings">
        <ErrorState message={settings.error} onRetry={settings.reload} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Settings" description="Business identity, contact details and section imagery">
      <div className="grid gap-4 xl:grid-cols-[1fr_22rem] items-start">
        <form onSubmit={handleSave} noValidate className="space-y-4 min-w-0">
          <Panel title="Business identity">
            <div className="p-5 space-y-4">
              <LocalizedInput
                label="Business name"
                hint="shown across the site"
                value={draft.businessName}
                onChange={value => set('businessName', value)}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="settings-short-name" hint="used in testimonials copy">
                    Short name
                  </Label>
                  <Input
                    id="settings-short-name"
                    value={draft.shortName}
                    onChange={event => set('shortName', event.target.value)}
                    placeholder="Garage Services"
                  />
                </div>
                <div>
                  <Label htmlFor="settings-contact-person">Contact person</Label>
                  <Input
                    id="settings-contact-person"
                    value={draft.contactPerson}
                    onChange={event => set('contactPerson', event.target.value)}
                    placeholder="Abdul"
                  />
                </div>
              </div>
            </div>
          </Panel>

          <Panel title="Contact details" description="Used by every call and email link on the site">
            <div className="p-5 grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="settings-phone" hint="displayed">
                  Phone
                </Label>
                <Input
                  id="settings-phone"
                  value={draft.phone}
                  onChange={event => set('phone', event.target.value)}
                  placeholder="(514) 553-4206"
                />
              </div>
              <div>
                <Label htmlFor="settings-phone-raw" hint="digits only, used by tel: links">
                  Dial number
                </Label>
                <Input
                  id="settings-phone-raw"
                  value={draft.phoneRaw}
                  onChange={event => set('phoneRaw', event.target.value)}
                  placeholder="5145534206"
                />
              </div>
              <div>
                <Label htmlFor="settings-email">Email</Label>
                <Input
                  id="settings-email"
                  type="email"
                  value={draft.email}
                  onChange={event => set('email', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="settings-social-name">Social media handle</Label>
                <Input
                  id="settings-social-name"
                  value={draft.socialMediaName}
                  onChange={event => set('socialMediaName', event.target.value)}
                />
              </div>
            </div>
          </Panel>

          <Panel
            title="Social links"
            description="Optional profile links"
            actions={
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => set('socialLinks', [...draft.socialLinks, { label: '', url: '' }])}
              >
                <Plus className="w-3.5 h-3.5" />
                Add link
              </Button>
            }
          >
            <div className="p-5 space-y-3">
              {draft.socialLinks.length === 0 && (
                <p className="text-[11px] text-neutral-600">No social links configured.</p>
              )}
              {draft.socialLinks.map((link, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-2">
                  <Input
                    value={link.label}
                    placeholder="Facebook"
                    aria-label={`Social link ${index + 1} label`}
                    onChange={event => {
                      const next = [...draft.socialLinks];
                      next[index] = { ...next[index], label: event.target.value };
                      set('socialLinks', next);
                    }}
                    className="sm:w-48"
                  />
                  <Input
                    value={link.url}
                    placeholder="https://…"
                    aria-label={`Social link ${index + 1} URL`}
                    onChange={event => {
                      const next = [...draft.socialLinks];
                      next[index] = { ...next[index], url: event.target.value };
                      set('socialLinks', next);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      set(
                        'socialLinks',
                        draft.socialLinks.filter((_, i) => i !== index)
                      )
                    }
                    aria-label={`Remove social link ${index + 1}`}
                    className="p-2.5 rounded-lg text-neutral-600 hover:text-red-400 hover:bg-red-500/10 transition-colors self-start"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Imagery" description="Logo and the two large section photographs">
            <div className="p-5 grid gap-4 sm:grid-cols-3">
              <ImageField
                id="settings-logo"
                label="Logo"
                value={draft.logoUrl}
                error={fields['logoUrl']}
                onChange={value => set('logoUrl', value)}
              />
              <ImageField
                id="settings-hero"
                label="Hero image"
                value={draft.heroImageUrl}
                error={fields['heroImageUrl']}
                onChange={value => set('heroImageUrl', value)}
              />
              <ImageField
                id="settings-about"
                label="About image"
                value={draft.aboutImageUrl}
                error={fields['aboutImageUrl']}
                onChange={value => set('aboutImageUrl', value)}
              />
            </div>
          </Panel>

          <div className="flex justify-end">
            <Button type="submit" loading={saving}>
              <Save className="w-3.5 h-3.5" />
              Save settings
            </Button>
          </div>
        </form>

        <div className="space-y-4 xl:sticky xl:top-20">
          <Panel title="Account">
            <div className="p-5 space-y-1">
              <p className="text-xs font-bold text-white">{admin?.name}</p>
              <p className="text-[11px] font-mono text-neutral-500 break-all">{admin?.email}</p>
            </div>
          </Panel>

          <Panel title="Change password">
            <form onSubmit={handlePasswordChange} noValidate className="p-5 space-y-4">
              <div>
                <Label htmlFor="current-password">Current password</Label>
                <Input
                  id="current-password"
                  type="password"
                  autoComplete="current-password"
                  value={passwords.currentPassword}
                  error={passwordFields['currentPassword']}
                  onChange={event =>
                    setPasswords({ ...passwords, currentPassword: event.target.value })
                  }
                />
                <FieldError message={passwordFields['currentPassword']} />
              </div>
              <div>
                <Label htmlFor="next-password" hint="at least 10 characters">
                  New password
                </Label>
                <Input
                  id="next-password"
                  type="password"
                  autoComplete="new-password"
                  value={passwords.nextPassword}
                  error={passwordFields['nextPassword']}
                  onChange={event => setPasswords({ ...passwords, nextPassword: event.target.value })}
                />
                <FieldError message={passwordFields['nextPassword']} />
              </div>
              <Button type="submit" variant="secondary" loading={changingPassword} className="w-full">
                <KeyRound className="w-3.5 h-3.5" />
                Update password
              </Button>
            </form>
          </Panel>
        </div>
      </div>
    </AdminLayout>
  );
};
