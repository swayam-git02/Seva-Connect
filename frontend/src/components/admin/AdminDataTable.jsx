import React from 'react';
import EmptyState from '../common/EmptyState';

export const AdminDataTable = ({ columns = [], data = [], keyField = 'id', onRowClick }) => {
  if (data.length === 0) {
    return <EmptyState title="No records found" description="Try adjusting your filters or search criteria." />;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900 shadow-card">
      <table className="w-full text-left text-xs text-slate-300">
        <thead className="bg-slate-800/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
          <tr>
            {columns.map((col) => (
              <th key={col.key || col.header} className={`py-3.5 px-4 ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {data.map((row, i) => (
            <tr
              key={row[keyField] || i}
              onClick={() => onRowClick && onRowClick(row)}
              className={`hover:bg-slate-800/50 transition-colors ${
                onRowClick ? 'cursor-pointer' : ''
              }`}
            >
              {columns.map((col) => (
                <td key={col.key || col.header} className={`py-3 px-4 ${col.className || ''}`}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDataTable;
