import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Check, Plus, Trash2 } from 'lucide-react';
import Button from '../common/Button';
import { useNotifications } from '../../hooks/useNotifications';

export const AvailabilityCalendar = () => {
  const [selectedDays, setSelectedDays] = useState([
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ]);
  const [slots, setSlots] = useState([
    '09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM', '06:00 PM'
  ]);
  const [newSlot, setNewSlot] = useState('');
  const { showSuccess } = useNotifications();

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const addSlot = (e) => {
    e.preventDefault();
    if (newSlot.trim() && !slots.includes(newSlot.trim())) {
      setSlots([...slots, newSlot.trim()]);
      setNewSlot('');
    }
  };

  const removeSlot = (slotToRemove) => {
    setSlots(slots.filter((s) => s !== slotToRemove));
  };

  const saveAvailability = () => {
    showSuccess('Availability Saved', 'Your working schedule and appointment slots have been updated.');
  };

  return (
    <div className="bg-white rounded-xl border border-surface-border p-6 shadow-card space-y-6">
      <div>
        <h3 className="text-base font-semibold text-content-dark flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-brand-600" />
          <span>Working Days & Weekly Schedule</span>
        </h3>
        <p className="mt-1 text-xs text-content-secondary">
          Select days when you are active to receive doorstep service requests.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {daysOfWeek.map((day) => {
            const isSelected = selectedDays.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-brand-50 border-brand-500 text-brand-700 shadow-sm'
                    : 'bg-white border-surface-border text-content-muted hover:border-slate-300'
                }`}
              >
                {day} {isSelected && '✓'}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100">
        <h3 className="text-base font-semibold text-content-dark flex items-center gap-2">
          <Clock className="h-5 w-5 text-brand-600" />
          <span>Daily Service Booking Slots</span>
        </h3>
        <p className="mt-1 text-xs text-content-secondary">
          Customers can schedule arrival during these verified slot intervals.
        </p>

        <div className="mt-4 flex flex-wrap gap-2.5">
          {slots.map((slot) => (
            <div
              key={slot}
              className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium text-content-dark"
            >
              <span>{slot}</span>
              <button
                type="button"
                onClick={() => removeSlot(slot)}
                className="text-content-muted hover:text-state-error transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={addSlot} className="mt-4 flex items-center gap-2 max-w-sm">
          <input
            type="text"
            value={newSlot}
            onChange={(e) => setNewSlot(e.target.value)}
            placeholder="e.g. 07:30 PM"
            className="flex-1 text-xs px-3 py-2 rounded-lg border border-surface-border bg-white focus:outline-none focus:border-brand-500"
          />
          <Button type="submit" variant="secondary" size="sm" leftIcon={Plus}>
            Add Slot
          </Button>
        </form>
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <Button variant="primary" onClick={saveAvailability}>
          Save Calendar Settings
        </Button>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
