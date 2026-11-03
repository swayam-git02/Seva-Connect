import React, { useState } from 'react';
import { Phone, MessageCircle, AlertTriangle, ShieldCheck, Send, CheckCircle2 } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import FormField from '../../components/common/FormField';
import { useNotifications } from '../../hooks/useNotifications';

export const CustomerHelpPage = () => {
  const { showSuccess } = useNotifications();
  const [complaints, setComplaints] = useState([
    {
      id: 'TKT-1082',
      bookingId: 'SC-8402',
      issue: 'Water tank pipe fitting alignment slight drip',
      status: 'RESOLVED',
      date: '2026-10-15',
    },
  ]);

  const [bookingId, setBookingId] = useState('');
  const [issueType, setIssueType] = useState('Technician Delayed');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRaiseComplaint = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const newTkt = {
        id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
        bookingId: bookingId || 'General',
        issue: `${issueType}: ${description.substring(0, 40)}...`,
        status: 'OPEN',
        date: new Date().toISOString().split('T')[0],
      };
      setComplaints([newTkt, ...complaints]);
      setIsSubmitting(false);
      setBookingId('');
      setDescription('');
      showSuccess('Ticket Raised', `Ticket #${newTkt.id} logged. A senior support specialist will call you.`);
    }, 900);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-content-dark tracking-tight">
          Customer Help & Dispute Support
        </h1>
        <p className="text-xs text-content-secondary mt-1">
          Have an issue with a technician, booking, or code verification? We resolve 95% of issues within 4 hours.
        </p>
      </div>

      {/* Emergency Contact Bar */}
      <div className="bg-emerald-900 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-emerald-800 text-emerald-300 flex items-center justify-center shrink-0">
            <Phone className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Direct NCR Escalation Hotline</h3>
            <p className="text-xs text-emerald-200">+91 (0129) 482-9000 • Priority 24/7 Desk</p>
          </div>
        </div>

        <a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 font-semibold text-xs rounded-xl flex items-center gap-2 transition-all shadow-sm"
        >
          <MessageCircle className="h-4 w-4" />
          <span>WhatsApp Chat Help</span>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Raise Complaint Form */}
        <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card space-y-4">
          <h3 className="text-base font-bold text-content-dark flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span>Raise a Complaint or Ticket</span>
          </h3>

          <form onSubmit={handleRaiseComplaint} className="space-y-4">
            <Input
              label="Related Booking ID (Optional)"
              placeholder="e.g. SC-8921"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
            />

            <div>
              <label className="block text-xs font-semibold text-content-dark mb-1.5">
                Issue Nature
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-surface-border bg-white focus:outline-none focus:border-brand-500"
              >
                <option value="Technician Delayed">Technician Delayed</option>
                <option value="Ending Code Pressure">Technician demanded Ending Code early</option>
                <option value="Unsatisfactory Repair">Unsatisfactory Repair Quality</option>
                <option value="Billing Dispute">Billing or Extra Charges Issue</option>
                <option value="Behavior Issue">Professional Conduct / Behavior</option>
              </select>
            </div>

            <FormField label="Describe What Happened" required>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide clear details so our supervisor can investigate..."
                required
                className="w-full text-xs p-3 rounded-lg border border-surface-border bg-white focus:outline-none focus:border-brand-500"
              />
            </FormField>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              isLoading={isSubmitting}
              rightIcon={Send}
            >
              Submit Dispute
            </Button>
          </form>
        </div>

        {/* Previous Tickets Status */}
        <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card space-y-4">
          <h3 className="text-base font-bold text-content-dark">
            My Raised Tickets & Status
          </h3>

          <div className="space-y-3">
            {complaints.map((c) => (
              <div key={c.id} className="p-4 bg-surface-muted rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-content-dark">#{c.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    c.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {c.status}
                  </span>
                </div>
                <p className="font-medium text-content-dark">{c.issue}</p>
                <div className="flex justify-between text-[11px] text-content-muted pt-1 border-t border-slate-200">
                  <span>Booking: {c.bookingId}</span>
                  <span>Date: {c.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerHelpPage;
