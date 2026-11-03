import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import FormField from '../../components/common/FormField';
import { useNotifications } from '../../hooks/useNotifications';
import { ROUTES } from '../../constants/routes';
import providerService from '../../services/providerService';

export const AddProviderServicePage = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('45 mins');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showError('Validation Error', 'Service title is required.');
      return;
    }
    if (!price || Number(price) <= 0) {
      showError('Validation Error', 'Please enter a valid price in Rupees.');
      return;
    }

    setIsSubmitting(true);
    try {
      await providerService.addService({
        title: title.trim(),
        price: Number(price),
        duration: duration.trim() || '45 mins',
        description: description.trim(),
      });
      showSuccess('Service Created', `${title} has been added to your offerings.`);
      navigate(ROUTES.PROVIDER_SERVICES);
    } catch (err) {
      showError('Failed to Create Service', err.message || 'Unable to save service offering.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to={ROUTES.PROVIDER_SERVICES} className="p-2 rounded-lg hover:bg-slate-200 transition-colors">
          <ArrowLeft className="h-5 w-5 text-content-secondary" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-content-dark">Add New Service Offering</h1>
          <p className="text-xs text-content-secondary">Set transparent pricing for customers</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Service Title"
            placeholder="e.g. Copper Pipe Leak Repair & Gas Top-up"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Standard Rate (₹)"
              type="number"
              placeholder="499"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />

            <Input
              label="Estimated Duration"
              placeholder="e.g. 60 mins"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </div>

          <FormField label="Service Scope Description">
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What tasks or tools are included in this service?"
              className="w-full text-xs p-3 rounded-lg border border-surface-border bg-white focus:outline-none focus:border-brand-500"
            />
          </FormField>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.PROVIDER_SERVICES)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
              Add to Rate Card
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProviderServicePage;
