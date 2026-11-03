import React, { useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/formatDate';
import { useNotifications } from '../../hooks/useNotifications';

export const ProviderReviewsPage = () => {
  const { showSuccess } = useNotifications();
  const [reviews, setReviews] = useState([
    {
      id: 'rev-1',
      customerName: 'Vikas Malhotra',
      rating: 5,
      date: '2026-03-12',
      service: 'MCB / Fuse Box Diagnosis',
      comment: 'Ramesh ji arrived right on time in Sector 15. Fixed the MCB tripping problem safely and cleanly without changing extra parts unnecessarily.',
      reply: 'Thank you Vikas ji for trusting our electrical services!',
    },
    {
      id: 'rev-2',
      customerName: 'Neha Grover',
      rating: 5,
      date: '2026-03-01',
      service: 'Ceiling Fan Installation',
      comment: 'Very polite professional. Verified the Starting Code before touching the switchboard and balanced the fan so there is zero wobbling. Highly recommended!',
      reply: '',
    },
  ]);

  const [replyInput, setReplyInput] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  const handleSendReply = (reviewId) => {
    if (!replyInput.trim()) return;
    setReviews(
      reviews.map((r) => (r.id === reviewId ? { ...r, reply: replyInput.trim() } : r))
    );
    showSuccess('Reply Published', 'Your response is now visible on your public profile.');
    setReplyingTo(null);
    setReplyInput('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-content-dark tracking-tight">
          Customer Ratings & Reviews
        </h1>
        <p className="text-xs text-content-secondary mt-1">
          Feedback left by customers after Ending Code verification.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card flex items-center gap-8">
        <div>
          <span className="text-4xl font-extrabold text-content-dark">4.9</span>
          <div className="flex items-center gap-1 text-amber-500 mt-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="h-4 w-4 fill-amber-500" />
            ))}
          </div>
          <span className="text-xs text-content-muted mt-1 block">Based on 142 reviews</span>
        </div>

        <div className="flex-1 space-y-1 text-xs border-l border-slate-100 pl-8">
          <div className="flex items-center justify-between">
            <span>5 Stars</span>
            <span className="font-bold text-content-dark">94%</span>
          </div>
          <div className="flex items-center justify-between">
            <span>4 Stars</span>
            <span className="font-bold text-content-dark">5%</span>
          </div>
          <div className="flex items-center justify-between">
            <span>3 Stars & Below</span>
            <span className="font-bold text-content-dark">1%</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl border border-surface-border p-5 shadow-subtle space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-content-dark">{r.customerName}</h4>
                <p className="text-[11px] text-content-muted">{r.service} • {formatDate(r.date)}</p>
              </div>

              <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-0.5 rounded">
                <Star className="h-3.5 w-3.5 fill-amber-500" />
                <span className="text-xs font-bold text-amber-800">{r.rating}.0</span>
              </div>
            </div>

            <p className="text-xs text-content-secondary leading-relaxed">"{r.comment}"</p>

            {r.reply ? (
              <div className="p-3 bg-brand-50/60 rounded-xl border border-brand-100 text-xs">
                <span className="font-bold text-brand-800 block">Your Response:</span>
                <p className="text-brand-900 mt-0.5">{r.reply}</p>
              </div>
            ) : replyingTo === r.id ? (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <input
                  type="text"
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  placeholder="Thank the customer or address feedback..."
                  className="w-full text-xs px-3 py-2 rounded-lg border border-surface-border bg-white focus:outline-none focus:border-brand-500"
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setReplyingTo(null)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => handleSendReply(r.id)}>
                    Publish Response
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setReplyingTo(r.id);
                    setReplyInput('');
                  }}
                  className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Reply to Review</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProviderReviewsPage;
