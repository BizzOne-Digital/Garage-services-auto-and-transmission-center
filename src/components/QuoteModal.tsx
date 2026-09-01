import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Phone, Send, CheckCircle } from 'lucide-react';
import { LeadFormData } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { ApiError, submitLead } from '../lib/leads';
import { useBusiness, useServices } from '../i18n/useContent';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceId?: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose, initialServiceId }) => {
  const { t, format, lang } = useLanguage();
  const business = useBusiness();
  const services = useServices();
  const [formData, setFormData] = useState<LeadFormData>({
    fullName: '',
    phone: '',
    email: '',
    vehicleMakeModel: '',
    vehicleYear: '',
    serviceNeeded: initialServiceId || 'transmission-services',
    transmissionType: 'automatic',
    urgency: 'asap',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (initialServiceId) {
      setFormData(prev => ({ ...prev, serviceNeeded: initialServiceId }));
    }
  }, [initialServiceId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof LeadFormData, string>> = {};
    if (!formData.fullName.trim()) newErrors.fullName = t.contact.errors.fullNameShort;
    if (!formData.phone.trim()) newErrors.phone = t.contact.errors.phoneShort;
    if (!formData.email.trim()) newErrors.email = t.contact.errors.emailShort;
    if (!formData.vehicleMakeModel.trim()) newErrors.vehicleMakeModel = t.contact.errors.vehicleShort;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setSubmitError(null);

    try {
      await submitLead(formData, 'quote-modal', lang);
      setSubmitted(true);
    } catch (error) {
      if (error instanceof ApiError && Object.keys(error.fields).length) {
        setErrors(error.fields as Partial<Record<keyof LeadFormData, string>>);
        setSubmitError(error.message);
      } else {
        setSubmitError(error instanceof ApiError ? error.message : t.contact.errors.submitFailed);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setSubmitError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-xl bg-[#141414] border border-neutral-700/90 rounded-2xl p-6 sm:p-8 shadow-2xl my-8 overflow-hidden"
          >
            {/* Top Accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#F5C400] to-transparent" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg bg-[#1F1F1F] text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-[#F5C400]"
              aria-label={t.quoteModal.ariaClose}
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-[#F5C400]/20 text-[#F5C400] flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-2">
                  {t.quoteModal.successTitle}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 mb-6 leading-relaxed">
                  {format(t.quoteModal.successBody, {
                    name: formData.fullName,
                    vehicle: formData.vehicleMakeModel,
                    phone: formData.phone,
                  })}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={`tel:${business.phoneRaw}`}
                    className="px-5 py-2.5 rounded-xl bg-[#F5C400] text-[#0A0A0A] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{t.common.callAbdul}</span>
                  </a>
                  <button
                    onClick={handleResetAndClose}
                    className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    {t.quoteModal.done}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#F5C400] block mb-1">
                    {t.quoteModal.eyebrow}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-tight">
                    {t.quoteModal.title}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    {t.quoteModal.intro}
                  </p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-300 mb-1">
                        {t.contact.fields.fullName} *
                      </label>
                      <input
                        type="text"
                        placeholder={t.contact.fields.namePlaceholder}
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#F5C400] ${
                          errors.fullName ? 'border-red-500' : 'border-neutral-700'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-300 mb-1">
                        {t.contact.fields.phone} *
                      </label>
                      <input
                        type="tel"
                        placeholder={t.contact.fields.phonePlaceholder}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#F5C400] ${
                          errors.phone ? 'border-red-500' : 'border-neutral-700'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-300 mb-1">
                        {t.contact.fields.email} *
                      </label>
                      <input
                        type="email"
                        placeholder={t.contact.fields.emailShortPlaceholder}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#F5C400] ${
                          errors.email ? 'border-red-500' : 'border-neutral-700'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-300 mb-1">
                        {t.contact.fields.vehicle} *
                      </label>
                      <input
                        type="text"
                        placeholder={t.contact.fields.vehicleShortPlaceholder}
                        value={formData.vehicleMakeModel}
                        onChange={(e) => setFormData({ ...formData, vehicleMakeModel: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#F5C400] ${
                          errors.vehicleMakeModel ? 'border-red-500' : 'border-neutral-700'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-300 mb-1">
                        {t.contact.fields.service}
                      </label>
                      <select
                        value={formData.serviceNeeded}
                        onChange={(e) => setFormData({ ...formData, serviceNeeded: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border border-neutral-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#F5C400]"
                      >
                        {services.map(s => (
                          <option key={s.id} value={s.id} className="bg-[#181818]">
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-300 mb-1">
                        {t.contact.fields.transmissionType}
                      </label>
                      <select
                        value={formData.transmissionType}
                        onChange={(e) => setFormData({ ...formData, transmissionType: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border border-neutral-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#F5C400]"
                      >
                        <option value="automatic">{t.contact.transmissionOptions.automatic}</option>
                        <option value="manual">{t.contact.transmissionOptions.manual}</option>
                        <option value="cvt">{t.contact.transmissionOptions.cvt}</option>
                        <option value="dual-clutch">{t.contact.transmissionOptions.dualClutch}</option>
                        <option value="unsure">{t.contact.transmissionOptions.unsureDiagnosis}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-300 mb-1">
                      {t.contact.fields.messageShort}
                    </label>
                    <textarea
                      rows={2}
                      placeholder={t.contact.fields.messageShortPlaceholder}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#F5C400]"
                    />
                  </div>

                  {submitError && (
                    <p
                      role="alert"
                      className="px-3.5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/40 text-[11px] text-red-300"
                    >
                      {submitError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-[#F5C400] hover:bg-[#E5B700] disabled:opacity-50 text-[#0A0A0A] font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all mt-2 active:scale-98"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-[#0A0A0A] border-t-transparent rounded-full animate-spin" />
                        <span>{t.quoteModal.submitting}</span>
                      </span>
                    ) : (
                      <>
                        <span>{t.quoteModal.submit}</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
