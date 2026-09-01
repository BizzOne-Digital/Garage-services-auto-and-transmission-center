import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Mail, Share2, MapPin, Send, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { BUSINESS_INFO } from '../lib/constants';
import { LeadFormData } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { useServices } from '../i18n/useContent';

interface ContactProps {
  initialServiceId?: string;
}

export const Contact: React.FC<ContactProps> = ({ initialServiceId }) => {
  const { t, format } = useLanguage();
  const services = useServices();
  const [formData, setFormData] = useState<LeadFormData>({
    fullName: '',
    phone: '',
    email: '',
    vehicleMakeModel: '',
    vehicleYear: '',
    serviceNeeded: initialServiceId || 'transmission-services',
    transmissionType: 'automatic',
    urgency: 'this-week',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof LeadFormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t.contact.errors.fullName;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t.contact.errors.phoneRequired;
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = t.contact.errors.phoneInvalid;
    }

    if (!formData.email.trim()) {
      newErrors.email = t.contact.errors.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.contact.errors.emailInvalid;
    }

    if (!formData.vehicleMakeModel.trim()) {
      newErrors.vehicleMakeModel = t.contact.errors.vehicle;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    // Simulate reliable submission & log for testing
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      console.log('Lead quote submitted successfully:', formData);
    }, 800);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      vehicleMakeModel: '',
      vehicleYear: '',
      serviceNeeded: 'transmission-services',
      transmissionType: 'automatic',
      urgency: 'this-week',
      message: '',
    });
    setErrors({});
  };

  return (
    <section id="contact" className="py-20 sm:py-28 bg-[#0A0A0A] relative overflow-hidden">
      {/* Background visual accents */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#F5C400]/5 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181818] border border-neutral-800 text-[11px] font-mono font-bold uppercase tracking-widest text-[#F5C400] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5C400]" />
            <span>{t.contact.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase">
            {t.contact.headline} <span className="text-[#F5C400]">{t.contact.headlineAccent}</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 mt-3 font-normal leading-relaxed">
            {t.contact.intro}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Business Info & Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Primary Business Card */}
            <div className="rounded-2xl bg-gradient-to-b from-[#181818] to-[#121212] border border-neutral-700/80 p-6 sm:p-8 shadow-xl">
              <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-1">
                {t.common.businessName}
              </h3>
              <p className="text-xs font-mono text-[#F5C400] mb-6">
                {format(t.contact.attn, { name: BUSINESS_INFO.contactPerson })}
              </p>

              <div className="space-y-4">
                {/* Phone */}
                <a
                  href={`tel:${BUSINESS_INFO.phoneRaw}`}
                  id="contact-info-phone-link"
                  className="flex items-center gap-4 p-3.5 rounded-xl bg-[#141414] hover:bg-[#1E1E1E] border border-neutral-800 hover:border-[#F5C400]/40 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#221D0C] text-[#F5C400] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-mono text-neutral-400 block">{t.contact.phoneLabel}</span>
                    <span className="text-sm font-bold text-white group-hover:text-[#F5C400] transition-colors">{BUSINESS_INFO.phone}</span>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${BUSINESS_INFO.email}`}
                  id="contact-info-email-link"
                  className="flex items-center gap-4 p-3.5 rounded-xl bg-[#141414] hover:bg-[#1E1E1E] border border-neutral-800 hover:border-[#F5C400]/40 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#221D0C] text-[#F5C400] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-mono text-neutral-400 block">{t.contact.emailLabel}</span>
                    <span className="text-sm font-bold text-white group-hover:text-[#F5C400] transition-colors break-all">{BUSINESS_INFO.email}</span>
                  </div>
                </a>

                {/* Social Media */}
                <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[#141414] border border-neutral-800">
                  <div className="w-10 h-10 rounded-lg bg-[#1C1C1C] text-[#F5C400] flex items-center justify-center shrink-0">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-mono text-neutral-400 block">{t.contact.socialLabel}</span>
                    <span className="text-xs font-semibold text-neutral-200">{BUSINESS_INFO.socialMediaName}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Prepared Location & Service Area Card */}
            <div className="rounded-2xl bg-[#121212] border border-neutral-800 p-6 shadow-xl">
              <div className="flex items-start gap-3.5 mb-3">
                <div className="p-2 rounded-lg bg-[#1E1E1E] text-[#F5C400] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-tight">
                    {t.contact.areaTitle}
                  </h4>
                  <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                    {t.contact.areaNotice}
                  </p>
                </div>
              </div>
              <div className="pt-3 mt-3 border-t border-neutral-800 text-[11px] text-neutral-400 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#F5C400]" />
                <span>{t.contact.areaNote}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Lead Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-gradient-to-b from-[#161616] to-[#101010] border border-neutral-700/80 p-6 sm:p-8 shadow-2xl relative">
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                  {t.contact.formTitle}
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  {t.contact.formIntro}
                </p>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 sm:p-8 rounded-xl bg-[#18150B] border border-[#F5C400]/50 text-center flex flex-col items-center"
                >
                  <div className="w-14 h-14 rounded-full bg-[#F5C400]/20 text-[#F5C400] flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-white uppercase tracking-tight mb-2">
                    {t.contact.successTitle}
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-300 max-w-md mb-6 leading-relaxed">
                    {format(t.contact.successBody, {
                      name: formData.fullName,
                      vehicle: formData.vehicleMakeModel,
                      phone: formData.phone,
                    })}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                    <a
                      href={`tel:${BUSINESS_INFO.phoneRaw}`}
                      className="px-6 py-2.5 rounded-xl bg-[#F5C400] text-[#0A0A0A] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      <span>{t.contact.successCall}</span>
                    </a>
                    <button
                      onClick={handleReset}
                      className="px-6 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                    >
                      {t.contact.successReset}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  
                  {/* Name & Phone Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                        {t.contact.fields.fullName} <span className="text-[#F5C400]">*</span>
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        placeholder={t.contact.fields.fullNamePlaceholder}
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl bg-[#121212] border text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#F5C400] transition-colors ${
                          errors.fullName ? 'border-red-500' : 'border-neutral-700 hover:border-neutral-600'
                        }`}
                      />
                      {errors.fullName && (
                        <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                        {t.contact.fields.phone} <span className="text-[#F5C400]">*</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        placeholder={t.contact.fields.phonePlaceholder}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl bg-[#121212] border text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#F5C400] transition-colors ${
                          errors.phone ? 'border-red-500' : 'border-neutral-700 hover:border-neutral-600'
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email & Vehicle Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                        {t.contact.fields.email} <span className="text-[#F5C400]">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder={t.contact.fields.emailPlaceholder}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl bg-[#121212] border text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#F5C400] transition-colors ${
                          errors.email ? 'border-red-500' : 'border-neutral-700 hover:border-neutral-600'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="vehicleMakeModel" className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                        {t.contact.fields.vehicle} <span className="text-[#F5C400]">*</span>
                      </label>
                      <input
                        id="vehicleMakeModel"
                        type="text"
                        placeholder={t.contact.fields.vehiclePlaceholder}
                        value={formData.vehicleMakeModel}
                        onChange={(e) => setFormData({ ...formData, vehicleMakeModel: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl bg-[#121212] border text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#F5C400] transition-colors ${
                          errors.vehicleMakeModel ? 'border-red-500' : 'border-neutral-700 hover:border-neutral-600'
                        }`}
                      />
                      {errors.vehicleMakeModel && (
                        <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.vehicleMakeModel}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Service Needed & Transmission Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="serviceNeeded" className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                        {t.contact.fields.service}
                      </label>
                      <select
                        id="serviceNeeded"
                        value={formData.serviceNeeded}
                        onChange={(e) => setFormData({ ...formData, serviceNeeded: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#121212] border border-neutral-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#F5C400]"
                      >
                        {services.map(s => (
                          <option key={s.id} value={s.id} className="bg-[#181818] text-white">
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="transmissionType" className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                        {t.contact.fields.transmissionType}
                      </label>
                      <select
                        id="transmissionType"
                        value={formData.transmissionType}
                        onChange={(e) => setFormData({ ...formData, transmissionType: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#121212] border border-neutral-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#F5C400]"
                      >
                        <option value="automatic" className="bg-[#181818]">{t.contact.transmissionOptions.automatic}</option>
                        <option value="manual" className="bg-[#181818]">{t.contact.transmissionOptions.manual}</option>
                        <option value="cvt" className="bg-[#181818]">{t.contact.transmissionOptions.cvt}</option>
                        <option value="dual-clutch" className="bg-[#181818]">{t.contact.transmissionOptions.dualClutch}</option>
                        <option value="unsure" className="bg-[#181818]">{t.contact.transmissionOptions.unsureInspection}</option>
                      </select>
                    </div>
                  </div>

                  {/* Message / Symptoms */}
                  <div>
                    <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                      {t.contact.fields.message}
                    </label>
                    <textarea
                      id="message"
                      rows={3}
                      placeholder={t.contact.fields.messagePlaceholder}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#121212] border border-neutral-700 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#F5C400]"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    id="contact-form-submit-btn"
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-[#F5C400] hover:bg-[#E5B700] disabled:opacity-50 text-[#0A0A0A] font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-[#F5C400]/25 transition-all flex items-center justify-center gap-2 active:scale-98"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-[#0A0A0A] border-t-transparent rounded-full animate-spin" />
                        <span>{t.contact.submitting}</span>
                      </span>
                    ) : (
                      <>
                        <span>{t.contact.submit}</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-neutral-500 font-mono">
                    {format(t.contact.dispatchNote, { email: BUSINESS_INFO.email })}
                  </p>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
