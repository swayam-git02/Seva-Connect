import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import FormField from '../../components/common/FormField';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { useNotifications } from '../../hooks/useNotifications';
import { ROUTES } from '../../constants/routes';
import providerService from '../../services/providerService';

export const EditProviderServicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('45 mins');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await providerService.getMyServices();
        const found = res.data?.find((s) => s.id === id);
        if (found) {
          setTitle(found.title || '');
          setPrice(String(found.price || ''));
          setDuration(found.duration || `${found.durationMins || 45} mins`);
          setDescription(found.description || '');
        } else {
          showError('Service Not Found', 'Could not locate the requested service.');
          navigate(ROUTES.PROVIDER_SERVICES);
        }
      } catch (e) {
        console.error(e);
        showError('Error', 'Unable to load service details.');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id, navigate]);

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
      await providerService.updateService(id, {
        title: title.trim(),
        price: Number(price),
        duration: duration.trim() || '45 mins',
        description: description.trim(),
      });
      showSuccess('Service Updated', 'Changes saved successfully.');
      navigate(ROUTES.PROVIDER_SERVICES);
    } catch (err) {
      showError('Update Failed', err.message || 'Unable to update service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <SkeletonLoader type="card" count={1} />;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to={ROUTES.PROVIDER_SERVICES} className="p-2 rounded-lg hover:bg-slate-200 transition-colors">
          <ArrowLeft className="h-5 w-5 text-content-secondary" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-content-dark">Edit Service Offering</h1>
          <p className="text-xs text-content-secondary">Modify rate or duration</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Service Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Standard Rate (₹)"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />

            <Input
              label="Estimated Duration"
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
              Update Rate
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProviderServicePage;
