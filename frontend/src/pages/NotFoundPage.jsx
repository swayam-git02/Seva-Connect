import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { ROUTES } from '../constants/routes';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-muted px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl border border-surface-border shadow-card">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-brand-50 text-brand-600 font-bold text-3xl">
          404
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-content-dark">Page Not Found</h1>
          <p className="text-sm text-content-muted">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            to={ROUTES.HOME}
            className="btn-primary inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium"
          >
            <Home className="h-4 w-4" />
            <span>Go to Home</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-outline inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
