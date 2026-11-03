import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import FormField from '../../components/common/FormField';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { ROUTES } from '../../constants/routes';

export const EditCustomerProfilePage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const { showSuccess } = useNotifications();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || 'House 412, Sector 15 Main Market, Faridabad, Haryana - 121007',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      updateUser(formData);
      setIsSaving(false);
      showSuccess('Profile Saved', 'Your contact details and address have been updated.');
      navigate(ROUTES.CUSTOMER_PROFILE);
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to={ROUTES.CUSTOMER_PROFILE} className="p-2 rounded-lg hover:bg-slate-200 transition-colors">
          <ArrowLeft className="h-5 w-5 text-content-secondary" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-content-dark">Edit Profile Details</h1>
          <p className="text-xs text-content-secondary">Update personal and address info</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input
              label="Mobile Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <FormField label="Default Doorstep Address" required>
            <textarea
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full text-xs p-3 rounded-lg border border-surface-border bg-white focus:outline-none focus:border-brand-500"
              required
            />
          </FormField>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.CUSTOMER_PROFILE)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isSaving}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCustomerProfilePage;
