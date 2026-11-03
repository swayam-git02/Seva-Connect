import React from 'react';
import AvailabilityCalendar from '../../components/provider/AvailabilityCalendar';

export const ProviderCalendarPage = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-content-dark tracking-tight">
          Calendar & Slot Manager
        </h1>
        <p className="text-xs text-content-secondary mt-1">
          Set your working days, block off-duty dates, and manage appointment booking windows.
        </p>
      </div>

      <AvailabilityCalendar />
    </div>
  );
};

export default ProviderCalendarPage;
