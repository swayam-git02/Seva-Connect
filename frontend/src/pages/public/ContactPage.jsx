import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import FormField from '../../components/common/FormField';
import { useNotifications } from '../../hooks/useNotifications';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess } = useNotifications();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showSuccess('Message Sent', 'Thank you! Our NCR support desk will get back to you within 2 hours.');
      setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
    }, 1000);
  };

  return (
    <div className="py-12 bg-surface-muted min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
            We Are Here To Help
          </span>
          <h1 className="text-3xl font-extrabold text-content-dark tracking-tight mt-1">
            Contact SevaConnect Support
          </h1>
          <p className="mt-2 text-sm text-content-secondary">
            Have questions about a booking, dual OTP verification, or partnership onboarding? Reach our local NCR team directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Details Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card space-y-6">
              <h3 className="text-base font-bold text-content-dark border-b border-slate-100 pb-3">
                Faridabad Headquarters
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-brand-50 text-brand-600 shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-content-dark">Registered Office</h4>
                    <p className="text-content-secondary mt-0.5 leading-relaxed">
                      SCO-42, Second Floor, Sector 15 Main Market, Faridabad, Haryana - 121007
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-brand-50 text-brand-600 shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-content-dark">Customer Support Line</h4>
                    <p className="text-content-secondary mt-0.5">+91 (0129) 482-9000 / +91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-brand-50 text-brand-600 shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-content-dark">Email Support</h4>
                    <p className="text-content-secondary mt-0.5">support@sevaconnect.in</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-brand-50 text-brand-600 shrink-0">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-content-dark">Operational Hours</h4>
                    <p className="text-content-secondary mt-0.5">08:00 AM – 09:00 PM (Monday – Sunday)</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Quick Link */}
              <div className="pt-2">
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Instant WhatsApp Help</span>
                </a>
              </div>
            </div>

            {/* Map Preview Card */}
            <div className="bg-white rounded-2xl border border-surface-border p-5 shadow-card">
              <h4 className="text-xs font-semibold text-content-dark mb-3">Service Hub Coverage</h4>
              <div className="h-40 rounded-xl bg-slate-100 relative overflow-hidden flex items-center justify-center border border-slate-200">
                <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80')` }} />
                <div className="relative text-center p-3 bg-white/90 backdrop-blur-sm rounded-lg border border-surface-border shadow-subtle">
                  <MapPin className="h-5 w-5 text-brand-600 mx-auto" />
                  <p className="text-[11px] font-bold text-content-dark mt-1">Sector 15 Hub, Faridabad</p>
                  <p className="text-[10px] text-content-muted">Dispatches to all NCR sectors</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-surface-border p-6 sm:p-8 shadow-card">
              <h3 className="text-lg font-bold text-content-dark mb-1">
                Send Us a Message
              </h3>
              <p className="text-xs text-content-secondary mb-6">
                Fill in the details below and our team will get in touch shortly.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    placeholder="Adarsh Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />

                  <Input
                    label="Mobile Number"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="adarsh@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-content-dark mb-1.5">
                      Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-surface-border bg-white focus:outline-none focus:border-brand-500"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Booking Assistance">Booking Assistance</option>
                      <option value="Starting/Ending Code Issue">Starting/Ending Code Issue</option>
                      <option value="Service Provider Partnership">Service Provider Partnership</option>
                      <option value="Feedback / Complaint">Feedback / Complaint</option>
                    </select>
                  </div>
                </div>

                <FormField label="Your Message / Query" required>
                  <textarea
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Please describe your query in detail..."
                    required
                    className="w-full rounded-lg border border-surface-border bg-white p-3 text-sm text-content-dark placeholder-content-placeholder focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </FormField>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    rightIcon={Send}
                  >
                    Send Message
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
