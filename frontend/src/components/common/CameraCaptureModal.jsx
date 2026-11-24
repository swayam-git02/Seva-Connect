// Component for live camera capture using device webcam/camera
// Desktop, tablet aur smartphone cameras ko live stream karke photo snap karne ki suvidha deta hai.

import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Check, AlertCircle } from 'lucide-react';
import Button from './Button';

export const CameraCaptureModal = ({ isOpen, onClose, onPhotoCaptured }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [error, setError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'user' or 'environment'
  const [isStarting, setIsStarting] = useState(false);

  // Start camera stream when modal opens
  const startCamera = async () => {
    setError(null);
    setIsStarting(true);
    setCapturedPhoto(null);

    // Stop existing stream if any
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error('Camera stream error:', err);
      // Fallback try without facingMode constraints
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = fallbackStream;
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          await videoRef.current.play();
        }
      } catch (fallbackErr) {
        setError(
          'Unable to access camera. Please allow camera permissions in your browser or choose a photo from files.'
        );
      }
    } finally {
      setIsStarting(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setCapturedPhoto(null);
      setError(null);
    }
    return () => stopCamera();
  }, [isOpen, facingMode]);

  // Snap photo from live video feed
  const handleSnapPhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const filename = `evidence_${Date.now()}.jpg`;
        const file = new File([blob], filename, { type: 'image/jpeg' });
        const previewUrl = URL.createObjectURL(blob);
        setCapturedPhoto({ file, previewUrl });
      },
      'image/jpeg',
      0.9
    );
  };

  // Confirm photo capture and send back to parent
  const handleConfirmPhoto = () => {
    if (capturedPhoto?.file) {
      onPhotoCaptured(capturedPhoto.file);
      stopCamera();
      onClose();
    }
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedPhoto(null);
    if (!streamRef.current) {
      startCamera();
    }
  };

  // Switch between front/back camera
  const handleToggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold">Capture Service Evidence</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Viewfinder area */}
        <div className="p-4 space-y-4">
          {error ? (
            <div className="p-6 text-center space-y-3 bg-rose-950/40 border border-rose-800/60 rounded-xl">
              <AlertCircle className="h-10 w-10 text-rose-400 mx-auto" />
              <p className="text-xs text-rose-200">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={startCamera}
                className="bg-transparent text-white border-slate-600 hover:bg-slate-800"
              >
                Try Again
              </Button>
            </div>
          ) : capturedPhoto ? (
            /* Photo Preview after snap */
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden aspect-video bg-black flex items-center justify-center border border-slate-800">
                <img
                  src={capturedPhoto.previewUrl}
                  alt="Captured Evidence"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-[10px]">
                  PHOTO READY
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRetake}
                  leftIcon={RefreshCw}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
                >
                  Retake Photo
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleConfirmPhoto}
                  leftIcon={Check}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Use This Photo
                </Button>
              </div>
            </div>
          ) : (
            /* Live Camera Feed */
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden aspect-video bg-black flex items-center justify-center border border-slate-800 shadow-inner">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {isStarting && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs text-slate-300">
                    Starting camera...
                  </div>
                )}

                {/* Target framing guide */}
                <div className="absolute inset-4 border-2 border-dashed border-white/30 rounded-lg pointer-events-none" />

                {/* Switch camera toggle if available */}
                <button
                  type="button"
                  onClick={handleToggleFacingMode}
                  className="absolute bottom-3 right-3 p-2 rounded-full bg-slate-900/80 border border-white/20 text-white hover:bg-slate-800 transition-colors"
                  title="Switch Camera"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleSnapPhoto}
                  disabled={isStarting}
                  className="h-14 w-14 rounded-full border-4 border-white bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all shadow-lg flex items-center justify-center"
                  title="Capture Photo"
                >
                  <div className="h-10 w-10 rounded-full border-2 border-slate-900/30" />
                </button>
              </div>
              <p className="text-[11px] text-center text-slate-400">
                Position work area inside the frame and tap the capture button.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraCaptureModal;
