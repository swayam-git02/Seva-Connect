import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import ServiceEditor from '../../components/provider/ServiceEditor';
import Button from '../../components/common/Button';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import providerService from '../../services/providerService';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

export const ProviderServicesPage = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const res = await providerService.getMyServices();
      if (res?.data && res.data.length > 0) {
        setServices(res.data);
      } else if (user?.id) {
        const pRes = await providerService.getProviderById(user.id);
        setServices(pRes.data?.services || []);
      }
    } catch (e) {
      console.error('Error loading provider services:', e);
      if (user?.id) {
        try {
          const pRes = await providerService.getProviderById(user.id);
          setServices(pRes.data?.services || []);
        } catch (err) {
          console.error(err);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [user]);

  const handleAddService = async (serviceData) => {
    const res = await providerService.addService(serviceData);
    await fetchServices();
    return res;
  };

  const handleDeleteService = async (serviceId) => {
    const res = await providerService.deleteService(serviceId);
    await fetchServices();
    return res;
  };

  if (loading) return <SkeletonLoader type="card" count={2} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-content-dark tracking-tight">
            My Services & Pricing Rates
          </h1>
          <p className="text-xs text-content-secondary mt-1">
            Manage your service offerings, labor rates, and duration estimates.
          </p>
        </div>

        <Link to={ROUTES.PROVIDER_SERVICES_ADD}>
          <Button variant="primary" size="sm" leftIcon={Plus}>
            Add New Service
          </Button>
        </Link>
      </div>

      <ServiceEditor
        services={services}
        onAdd={handleAddService}
        onDelete={handleDeleteService}
      />
    </div>
  );
};

export default ProviderServicesPage;
