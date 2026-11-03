import React from 'react';
import { Ban, CheckCircle, Eye } from 'lucide-react';

export const UserStatusActions = ({ user, onToggleBlock, onViewDetails }) => {
  const isBlocked = user.status === 'BLOCKED';

  return (
    <div className="flex items-center gap-2">
      {onViewDetails && (
        <button
          type="button"
          onClick={() => onViewDetails(user)}
          className="p-1 text-slate-400 hover:text-white transition-colors"
          title="View User Details"
        >
          <Eye className="h-4 w-4" />
        </button>
      )}

      {onToggleBlock && (
        <button
          type="button"
          onClick={() => onToggleBlock(user)}
          className={`p-1 transition-colors ${
            isBlocked ? 'text-emerald-400 hover:text-emerald-300' : 'text-rose-400 hover:text-rose-300'
          }`}
          title={isBlocked ? 'Unblock User' : 'Block User'}
        >
          {isBlocked ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
};

export default UserStatusActions;
