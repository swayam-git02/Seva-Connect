// Component providing dual choice: 'Open Camera' vs 'Choose a File' for service evidence photos
// Both Before-service and After-service evidence use this component.

import React, { useRef, useState } from 'react';
import { Camera, FolderOpen, UploadCloud, X, Image as ImageIcon, Sparkles, CheckCircle2 } from 'lucide-react';
import Button from './Button';
import CameraCaptureModal from './CameraCaptureModal';

export const EvidencePhotoPicker = ({
  stage = 'before', // 'before' | 'after'
  title = 'Upload Before-Service Photo(s)',
  files = [],
  onFilesChange,
  caption = '',
  onCaptionChange,
  onUpload,
  isUploading = false,
  accentColor = 'brand', // 'brand' | 'emerald'
}) => {
  const fileInputRef = useRef(null);
  const nativeCameraInputRef = useRef(null);
  const [showLiveCameraModal, setShowLiveCameraModal] = useState(false);

  // Handle native file selection
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      onFilesChange([...files, ...selected]);
    }
    e.target.value = '';
  };

  // Handle live camera capture from modal
  const handleCameraPhotoCaptured = (capturedFile) => {
    onFilesChange([...files, capturedFile]);
  };

  // Remove a single photo from preview list
  const handleRemovePhoto = (index) => {
    const updated = files.filter((_, i) => i !== index);
    onFilesChange(updated);
  };

  // Quick detect if user is on mobile/tablet to launch native camera directly, or open viewfinder
  const handleOpenCameraClick = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile && nativeCameraInputRef.current) {
      // Direct native camera trigger on smartphones/tablets
      nativeCameraInputRef.current.click();
    } else {
      // Desktop / laptop webcam modal
      setShowLiveCameraModal(true);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
          <Camera className={`h-4 w-4 ${accentColor === 'emerald' ? 'text-emerald-600' : 'text-brand-600'}`} />
          <span>{title}</span>
        </div>
        <span className="text-[10px] text-slate-500 font-semibold">
          {files.length} {files.length === 1 ? 'photo' : 'photos'} chosen
        </span>
      </div>

      {/* Hidden inputs */}
      {/* 1. File picker (gallery / local storage) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* 2. Direct mobile camera capture input */}
      <input
        ref={nativeCameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Dual action choice buttons: Open Camera VS Choose File */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleOpenCameraClick}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border-2 border-dashed border-emerald-300 bg-emerald-50/60 hover:bg-emerald-100/70 text-emerald-800 text-xs font-bold transition-all shadow-2xs hover:shadow-xs active:scale-98"
        >
          <Camera className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Open Camera</span>
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all shadow-2xs hover:shadow-xs active:scale-98"
        >
          <FolderOpen className="h-4 w-4 text-brand-600 shrink-0" />
          <span>Choose File</span>
        </button>
      </div>

      {/* Selected Photos Thumbnails Preview */}
      {files.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
            Selected Photo(s):
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {files.map((file, idx) => {
              const previewUrl = URL.createObjectURL(file);
              return (
                <div
                  key={`${file.name}-${idx}`}
                  className="relative group shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-slate-300 bg-slate-100 shadow-2xs"
                >
                  <img src={previewUrl} alt={file.name} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-rose-600 text-white shadow-xs hover:bg-rose-700 transition-colors"
                    title="Remove Photo"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <span className="absolute bottom-0 inset-x-0 bg-slate-900/70 text-white text-[8px] truncate px-1 text-center">
                    {idx + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Description / Caption input */}
      <input
        type="text"
        value={caption}
        onChange={(e) => onCaptionChange(e.target.value)}
        placeholder={
          stage === 'before'
            ? 'Photo description (e.g., initial switch condition before start)'
            : 'Photo description (e.g., repaired appliance tested & running)'
        }
        className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-500 bg-white"
      />

      {/* Upload button */}
      <Button
        size="sm"
        variant="primary"
        onClick={onUpload}
        isLoading={isUploading}
        disabled={!files.length}
        className={`w-full text-xs font-bold ${
          accentColor === 'emerald'
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
            : 'bg-brand-600 hover:bg-brand-700 text-white'
        }`}
        leftIcon={UploadCloud}
      >
        <span>
          Upload {stage === 'before' ? 'Before' : 'After'} Photo{files.length > 1 ? 's' : ''} ({files.length})
        </span>
      </Button>

      {/* Live Webcam Modal for desktop/laptop */}
      <CameraCaptureModal
        isOpen={showLiveCameraModal}
        onClose={() => setShowLiveCameraModal(false)}
        onPhotoCaptured={handleCameraPhotoCaptured}
      />
    </div>
  );
};

export default EvidencePhotoPicker;
