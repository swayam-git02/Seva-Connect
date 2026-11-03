// Ye panel provider ko active booking par Starting/Ending Code verification aur evidence workflow ka UI deta hai.

import React, { useState } from 'react';
import {
  ShieldCheck,
  PlayCircle,
  CheckCircle2,
  AlertCircle,
  Phone,
  MapPin,
  Clock,
  Camera,
  UploadCloud,
} from 'lucide-react';
import Button from '../common/Button';
import ServicePhotoGallery from '../bookings/ServicePhotoGallery';
import verificationService from '../../services/verificationService';
import photoService from '../../services/photoService';
import { BOOKING_STATUS } from '../../constants/bookingStatuses';
import { useNotifications } from '../../hooks/useNotifications';

export const ActiveJobPanel = ({ booking, onStatusUpdated }) => {
  const [startingCodeInput, setStartingCodeInput] = useState('');
  const [endingCodeInput, setEndingCodeInput] = useState('');
  const [isVerifyingStart, setIsVerifyingStart] = useState(false);
  const [isVerifyingEnd, setIsVerifyingEnd] = useState(false);

  // Photo upload states
  const [beforeFiles, setBeforeFiles] = useState([]);
  const [beforeCaption, setBeforeCaption] = useState('');
  const [isUploadingBefore, setIsUploadingBefore] = useState(false);

  const [afterFiles, setAfterFiles] = useState([]);
  const [afterCaption, setAfterCaption] = useState('');
  const [isUploadingAfter, setIsUploadingAfter] = useState(false);

  const [galleryRefreshKey, setGalleryRefreshKey] = useState(0);

  const { showSuccess, showError } = useNotifications();

  // 1. Upload Before Photos
  const handleUploadBeforePhotos = async (e) => {
    e.preventDefault();
    if (!beforeFiles.length) {
      showError('File Required', 'Please select at least one before-service photograph.');
      return;
    }
    setIsUploadingBefore(true);
    try {
      await photoService.uploadBeforePhotos(booking.id, beforeFiles, beforeCaption);
      showSuccess('Evidence Uploaded', 'Before-service photographs uploaded successfully.');
      setBeforeFiles([]);
      setBeforeCaption('');
      setGalleryRefreshKey((k) => k + 1);
    } catch (err) {
      showError('Upload Error', err.message || 'Failed to upload photographs.');
    } finally {
      setIsUploadingBefore(false);
    }
  };

  // 2. Upload After Photos
  const handleUploadAfterPhotos = async (e) => {
    e.preventDefault();
    if (!afterFiles.length) {
      showError('File Required', 'Please select at least one after-service photograph.');
      return;
    }
    setIsUploadingAfter(true);
    try {
      await photoService.uploadAfterPhotos(booking.id, afterFiles, afterCaption);
      showSuccess('Evidence Uploaded', 'After-service photographs uploaded successfully.');
      setAfterFiles([]);
      setAfterCaption('');
      setGalleryRefreshKey((k) => k + 1);
    } catch (err) {
      showError('Upload Error', err.message || 'Failed to upload photographs.');
    } finally {
      setIsUploadingAfter(false);
    }
  };

  // 3. Verify Starting Code (6-digit)
  const handleVerifyStartingCode = async (e) => {
    e.preventDefault();
    if (startingCodeInput.trim().length !== 6 && startingCodeInput.trim().length !== 4) {
      showError('Validation Error', 'Please enter a valid 6-digit Starting Code provided by customer.');
      return;
    }
    setIsVerifyingStart(true);
    try {
      const res = await verificationService.verifyStartingCode(booking.id, startingCodeInput.trim());
      showSuccess('Service Started', res.message || 'Starting code accepted! Work is now in progress.');
      setStartingCodeInput('');
      if (onStatusUpdated) onStatusUpdated();
    } catch (err) {
      showError('Starting Code Error', err.message || 'Incorrect Starting Code. Please verify with customer.');
    } finally {
      setIsVerifyingStart(false);
    }
  };

  // 4. Verify Ending Code (6-digit)
  const handleVerifyEndingCode = async (e) => {
    e.preventDefault();
    if (endingCodeInput.trim().length !== 6 && endingCodeInput.trim().length !== 4) {
      showError('Validation Error', 'Please enter a valid 6-digit Ending Code provided by customer.');
      return;
    }
    setIsVerifyingEnd(true);
    try {
      const res = await verificationService.verifyEndingCode(booking.id, endingCodeInput.trim());
      showSuccess('Job Completed', res.message || 'Job closed successfully! Payout credited to your wallet.');
      setEndingCodeInput('');
      if (onStatusUpdated) onStatusUpdated();
    } catch (err) {
      showError('Ending Code Error', err.message || 'Incorrect Ending Code. Please request customer for completion code.');
    } finally {
      setIsVerifyingEnd(false);
    }
  };

  const isStarted = booking.status === BOOKING_STATUS.STARTED || booking.status === 'in_progress';
  const isCompleted = booking.status === BOOKING_STATUS.COMPLETED || booking.status === 'completed';

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
        {/* Header banner */}
        <div className="bg-slate-900 text-white p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800">
                ACTIVE JOB #{booking.id}
              </span>
              <span className="text-xs text-slate-300">• {booking.serviceTitle}</span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">
              Customer: {booking.customerName}
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Clock className="h-4 w-4 text-emerald-400" />
            <span>Scheduled: {booking.scheduledTime}</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Location & Contact details */}
          <div className="bg-surface-muted p-4 rounded-xl border border-surface-border grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <span className="font-semibold text-content-muted uppercase tracking-wider block">Address</span>
              <div className="flex items-start gap-2 text-content-dark font-medium">
                <MapPin className="h-4 w-4 text-brand-500 shrink-0 mt-0.5" />
                <span>{booking.customerAddress}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="font-semibold text-content-muted uppercase tracking-wider block">Customer Contact</span>
              <div className="flex items-center gap-2 text-content-dark font-medium">
                <Phone className="h-4 w-4 text-brand-500 shrink-0" />
                <span>{booking.customerPhone}</span>
              </div>
            </div>
          </div>

          {/* Dual Code Verification & Photographic Evidence Workflow */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* STEP 1: Before Photos & Starting Code */}
            <div className={`p-5 rounded-xl border space-y-4 ${
              isStarted || isCompleted
                ? 'bg-slate-50 border-slate-200'
                : 'bg-emerald-50/40 border-emerald-300 ring-2 ring-emerald-500/10'
            }`}>
              <div className="flex items-center gap-2">
                <PlayCircle className={`h-5 w-5 ${isStarted || isCompleted ? 'text-slate-400' : 'text-emerald-600'}`} />
                <h4 className="text-sm font-bold text-content-dark">
                  1. Before-Service Evidence & Start
                </h4>
              </div>

              {/* Photo Upload for Before Stage */}
              {!isCompleted && (
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                    <Camera className="h-4 w-4 text-brand-600" />
                    <span>Upload Before-Service Photo(s)</span>
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={(e) => setBeforeFiles(Array.from(e.target.files))}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                  />
                  <input
                    type="text"
                    value={beforeCaption}
                    onChange={(e) => setBeforeCaption(e.target.value)}
                    placeholder="Photo description (e.g., initial switch condition)"
                    className="w-full text-xs py-1.5 px-2.5 rounded border border-slate-200"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleUploadBeforePhotos}
                    isLoading={isUploadingBefore}
                    disabled={!beforeFiles.length}
                    className="w-full text-xs"
                    leftIcon={UploadCloud}
                  >
                    Upload Before Photo
                  </Button>
                </div>
              )}

              {isStarted || isCompleted ? (
                <div className="bg-emerald-100/70 border border-emerald-300 p-3 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Starting Code Verified at {booking.startingCodeVerifiedAt ? new Date(booking.startingCodeVerifiedAt).toLocaleTimeString() : 'Earlier'}</span>
                </div>
              ) : (
                <form onSubmit={handleVerifyStartingCode} className="space-y-3 pt-2">
                  <p className="text-xs text-content-secondary leading-relaxed">
                    Ask customer for their 6-digit Starting Code upon arrival before touching tools.
                  </p>
                  <input
                    type="text"
                    maxLength={6}
                    value={startingCodeInput}
                    onChange={(e) => setStartingCodeInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit code"
                    className="w-full text-center tracking-[0.4em] font-mono text-xl font-bold py-2.5 px-3 rounded-lg border border-slate-300 focus:border-brand-500 focus:outline-none bg-white"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    isLoading={isVerifyingStart}
                  >
                    Verify & Start Service
                  </Button>
                </form>
              )}
            </div>

            {/* STEP 2: After Photos & Ending Code */}
            <div className={`p-5 rounded-xl border space-y-4 ${
              isCompleted
                ? 'bg-slate-50 border-slate-200'
                : isStarted
                ? 'bg-brand-50/40 border-brand-300 ring-2 ring-brand-500/10'
                : 'bg-slate-50/50 border-slate-200 opacity-60'
            }`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`h-5 w-5 ${isCompleted ? 'text-slate-400' : 'text-brand-600'}`} />
                <h4 className="text-sm font-bold text-content-dark">
                  2. After-Service Evidence & Completion
                </h4>
              </div>

              {/* Photo Upload for After Stage */}
              {isStarted && !isCompleted && (
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                    <Camera className="h-4 w-4 text-emerald-600" />
                    <span>Upload After-Service Photo(s)</span>
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={(e) => setAfterFiles(Array.from(e.target.files))}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                  <input
                    type="text"
                    value={afterCaption}
                    onChange={(e) => setAfterCaption(e.target.value)}
                    placeholder="Photo description (e.g., repaired appliance running)"
                    className="w-full text-xs py-1.5 px-2.5 rounded border border-slate-200"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleUploadAfterPhotos}
                    isLoading={isUploadingAfter}
                    disabled={!afterFiles.length}
                    className="w-full text-xs"
                    leftIcon={UploadCloud}
                  >
                    Upload After Photo
                  </Button>
                </div>
              )}

              {isCompleted ? (
                <div className="bg-emerald-100/70 border border-emerald-300 p-3 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Job Completed & Settlement Processed</span>
                </div>
              ) : (
                <form onSubmit={handleVerifyEndingCode} className="space-y-3 pt-2">
                  <p className="text-xs text-content-secondary leading-relaxed">
                    Once repair is complete and room is clean, ask the customer for their 6-digit Ending Code.
                  </p>
                  <input
                    type="text"
                    maxLength={6}
                    disabled={!isStarted}
                    value={endingCodeInput}
                    onChange={(e) => setEndingCodeInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit code"
                    className="w-full text-center tracking-[0.4em] font-mono text-xl font-bold py-2.5 px-3 rounded-lg border border-slate-300 focus:border-brand-500 focus:outline-none bg-white disabled:bg-slate-100 disabled:cursor-not-allowed"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    disabled={!isStarted}
                    isLoading={isVerifyingEnd}
                  >
                    Verify & Complete Job
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Service Photograph Evidence Gallery */}
      <ServicePhotoGallery key={galleryRefreshKey} bookingId={booking.id} />
    </div>
  );
};

export default ActiveJobPanel;
