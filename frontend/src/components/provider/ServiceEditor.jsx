import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import { formatCurrency } from '../../utils/formatCurrency';
import { useNotifications } from '../../hooks/useNotifications';

export const ServiceEditor = ({ services = [], onSave, onAdd, onDelete }) => {
  const [list, setList] = useState(services);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const { showSuccess, showError } = useNotifications();

  useEffect(() => {
    setList(services);
  }, [services]);

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice || Number(newPrice) <= 0) {
      showError('Validation Error', 'Service title and a valid price are required.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        title: newTitle.trim(),
        price: Number(newPrice),
        duration: newDuration.trim() || '45 mins',
      };

      if (onAdd) {
        await onAdd(payload);
      } else {
        const item = {
          id: `s-${Date.now()}`,
          ...payload,
        };
        const updated = [...list, item];
        setList(updated);
        if (onSave) onSave(updated);
      }

      setNewTitle('');
      setNewPrice('');
      setNewDuration('');
      setShowAddForm(false);
      showSuccess('Service Added', `${payload.title} added to your offerings.`);
    } catch (err) {
      showError('Failed to Add Service', err.message || 'Unable to save service.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async (id) => {
    setDeletingId(id);
    try {
      if (onDelete) {
        await onDelete(id);
      } else {
        const updated = list.filter((s) => s.id !== id);
        setList(updated);
        if (onSave) onSave(updated);
      }
      showSuccess('Service Removed', 'Offering removed from your public rate card.');
    } catch (err) {
      showError('Delete Failed', err.message || 'Unable to remove service.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-surface-border p-6 shadow-card space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-content-dark">
            Offered Services & Rate Card
          </h3>
          <p className="mt-0.5 text-xs text-content-secondary">
            Set fixed upfront pricing for each repair task you perform.
          </p>
        </div>

        {!showAddForm && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddForm(true)}
            leftIcon={Plus}
          >
            Add New Service
          </Button>
        )}
      </div>

      {/* Add new service form */}
      {showAddForm && (
        <form onSubmit={handleAddService} className="p-4 bg-surface-muted rounded-xl border border-surface-border space-y-3">
          <h4 className="text-xs font-semibold text-content-dark">Add New Service Item</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Service Title"
              placeholder="e.g. Inverter Wiring Fix"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
            <Input
              label="Price (₹)"
              type="number"
              placeholder="299"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              required
            />
            <Input
              label="Est. Duration"
              placeholder="e.g. 45 mins"
              value={newDuration}
              onChange={(e) => setNewDuration(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isSaving}>
              Save Offering
            </Button>
          </div>
        </form>
      )}

      {/* Existing services table/list */}
      {list.length === 0 ? (
        <div className="py-8 text-center text-xs text-content-muted border border-dashed border-slate-200 rounded-xl">
          No services added yet. Click &quot;Add New Service&quot; above to set your pricing offerings.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {list.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between text-xs gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-content-dark truncate">{item.title}</p>
                <p className="text-[11px] text-content-muted">Avg time: {item.duration || `${item.durationMins || 45} mins`}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-bold text-sm text-brand-700">
                  {formatCurrency(item.price)}
                </span>
                <Link
                  to={`/provider/services/${item.id}/edit`}
                  className="p-1.5 text-content-muted hover:text-brand-600 rounded transition-colors"
                  title="Edit service"
                >
                  <Edit2 className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  disabled={deletingId === item.id}
                  onClick={() => handleRemove(item.id)}
                  className="p-1.5 text-content-muted hover:text-state-error rounded transition-colors disabled:opacity-50"
                  title="Remove service"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceEditor;
