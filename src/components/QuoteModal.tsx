import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Phone, Send, CheckCircle, AlertCircle, Wrench, ShieldCheck } from 'lucide-react';
import { BUSINESS_INFO, SERVICES } from '../lib/constants';
import { LeadFormData } from '../types';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceId?: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose, initialServiceId }) => {
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
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required.';
    if (!formData.email.trim()) newErrors.email = 'Email address is required.';
    if (!formData.vehicleMakeModel.trim()) newErrors.vehicleMakeModel = 'Vehicle make & model required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      console.log('Modal quote submission:', formData);
    }, 700);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
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
              aria-label="Close quote modal"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-[#F5C400]/20 text-[#F5C400] flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-2">
                  Quote Request Dispatched
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 mb-6 leading-relaxed">
                  Thank you, <span className="text-white font-bold">{formData.fullName}</span>. Abdul will review your vehicle details (<span className="text-[#F5C400]">{formData.vehicleMakeModel}</span>) and contact you shortly at {formData.phone}.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={`tel:${BUSINESS_INFO.phoneRaw}`}
                    className="px-5 py-2.5 rounded-xl bg-[#F5C400] text-[#0A0A0A] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Abdul Now</span>
                  </a>
                  <button
                    onClick={handleResetAndClose}
                    className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#F5C400] block mb-1">
                    Direct Estimation System
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-tight">
                    Get a Free Quote
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Fast turnaround with honest, transparent pricing from Abdul.
                  </p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-300 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#F5C400] ${
                          errors.fullName ? 'border-red-500' : 'border-neutral-700'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-300 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        placeholder="(514) 993-7705"
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
                        Email Address *
                      </label>
                      <input
                        type="email"
                        placeholder="name@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#F5C400] ${
                          errors.email ? 'border-red-500' : 'border-neutral-700'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-300 mb-1">
                        Vehicle Make & Model *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 2017 Ford F-150"
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
                        Service Needed
                      </label>
                      <select
                        value={formData.serviceNeeded}
                        onChange={(e) => setFormData({ ...formData, serviceNeeded: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border border-neutral-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#F5C400]"
                      >
                        {SERVICES.map(s => (
                          <option key={s.id} value={s.id} className="bg-[#181818]">
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-300 mb-1">
                        Transmission Type
                      </label>
                      <select
                        value={formData.transmissionType}
                        onChange={(e) => setFormData({ ...formData, transmissionType: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border border-neutral-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#F5C400]"
                      >
                        <option value="automatic">Automatic</option>
                        <option value="manual">Manual / Standard</option>
                        <option value="cvt">CVT (Continuously Variable)</option>
                        <option value="dual-clutch">Dual-Clutch / DSG</option>
                        <option value="unsure">Unsure / Need Diagnosis</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-300 mb-1">
                      Symptoms / Notes
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Brief note about the issue or required work..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#F5C400]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-[#F5C400] hover:bg-[#E5B700] disabled:opacity-50 text-[#0A0A0A] font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all mt-2 active:scale-98"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-[#0A0A0A] border-t-transparent rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </span>
                    ) : (
                      <>
                        <span>Submit Quote Request</span>
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
