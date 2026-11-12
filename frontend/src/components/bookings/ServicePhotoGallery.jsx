// Ye gallery booking se judi before-service aur after-service evidence photos ko authorized user ke liye dikhati hai.

import React, { useState, useEffect } from 'react';
import { Camera, Image as ImageIcon, ZoomIn, X, Clock } from 'lucide-react';
import photoService from '../../services/photoService';
import { resolveImageUrl, FALLBACK_PLACEHOLDER } from '../../utils/imageHelpers';

export const ServicePhotoGallery = ({ bookingId }) => {
  const [photos, setPhotos] = useState({ before: [], after: [] });
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchPhotos = async () => {
    if (!bookingId) return;
    try {
      const res = await photoService.getBookingPhotos(bookingId);
      if (res?.data) {
        setPhotos({
          before: res.data.before || [],
          after: res.data.after || [],
        });
      }
    } catch (err) {
      console.error('Failed to load photos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [bookingId]);

  const renderPhotoGrid = (items, stageLabel, emptyMessage) => {
    if (loading) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="aspect-video bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      );
    }

    if (!items || items.length === 0) {
      return (
        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-6 text-center">
          <Camera className="h-6 w-6 text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-content-muted">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((photo) => (
          <div
            key={photo.id}
            className="group relative aspect-video bg-slate-100 rounded-xl overflow-hidden border border-surface-border shadow-subtle cursor-pointer"
            onClick={() => setSelectedImage(photo)}
          >
            <img
              src={resolveImageUrl(photo.imageUrl)}
              alt={photo.caption || stageLabel}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = FALLBACK_PLACEHOLDER;
              }}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-medium">
              <ZoomIn className="h-4 w-4" />
              <span>Enlarge</span>
            </div>
            {photo.caption && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-[10px] text-white truncate">
                {photo.caption}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Camera className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              Service Evidence Photographs
            </h3>
            <p className="text-xs text-slate-400">
              Verified photographic proof captured before work starts and after completion
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 text-emerald-400 border border-slate-700">
          {(photos.before.length || 0) + (photos.after.length || 0)} Photos
        </span>
      </div>

      <div className="p-6 space-y-6">
        {/* Section 1: Before Service */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <h4 className="text-xs font-bold text-content-dark uppercase tracking-wider">
                1. Before Service (Initial Inspection Condition)
              </h4>
            </div>
            <span className="text-[11px] text-content-muted">
              {photos.before.length} photo{photos.before.length === 1 ? '' : 's'}
            </span>
          </div>
          {renderPhotoGrid(
            photos.before,
            'Before Service',
            'No before-service photographs uploaded yet. The technician will take photos upon doorstep arrival.'
          )}
        </div>

        {/* Section 2: After Service */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <h4 className="text-xs font-bold text-content-dark uppercase tracking-wider">
                2. After Service (Completed Work Evidence)
              </h4>
            </div>
            <span className="text-[11px] text-content-muted">
              {photos.after.length} photo{photos.after.length === 1 ? '' : 's'}
            </span>
          </div>
          {renderPhotoGrid(
            photos.after,
            'After Service',
            'No after-service photographs uploaded yet. The technician will capture photos after completing the job.'
          )}
        </div>
      </div>

      {/* Enlarged Photo Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="p-2">
              <img
                src={resolveImageUrl(selectedImage.imageUrl)}
                alt={selectedImage.caption || 'Enlarged photo'}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_PLACEHOLDER;
                }}
                className="w-full max-h-[75vh] object-contain rounded-xl mx-auto"
              />
            </div>
            {selectedImage.caption && (
              <div className="p-4 bg-slate-950 text-slate-200 text-xs border-t border-slate-800 flex items-center justify-between">
                <span>{selectedImage.caption}</span>
                {selectedImage.createdAt && (
                  <span className="text-[10px] text-slate-400">
                    {new Date(selectedImage.createdAt).toLocaleString()}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePhotoGallery;
