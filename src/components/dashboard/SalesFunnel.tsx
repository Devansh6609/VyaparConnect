

import React from 'react';

// FIX: Exported the SalesFunnelProps interface to make it available for import in other modules, resolving an import error in AnalyticsChart.tsx.
export interface SalesFunnelProps {
  data: { stage: string; count: number }[];
}

const STAGE_CONFIG: { [key: string]: { label: string; color: string } } = {
  NEW_LEAD: { label: 'New Lead', color: 'bg-blue-500' },
  CONTACTED: { label: 'Contacted', color: 'bg-indigo-500' },
  QUOTATION_SENT: { label: 'Quotation Sent', color: 'bg-purple-500' },
  PAYMENT_PENDING: { label: 'Payment Pending', color: 'bg-yellow-500' },
  COMPLETED: { label: 'Completed', color: 'bg-green-500' },
  LOST: { label: 'Lost', color: 'bg-red-500' },
  Unknown: { label: 'Unknown', color: 'bg-gray-400' }
};

const SalesFunnel: React.FC<SalesFunnelProps> = ({ data = [] }) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100/50 h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Funnel</h3>
      {data.length > 0 ? (
        <div className="space-y-4">
          {data.map(({ stage, count }) => {
            const config = STAGE_CONFIG[stage] || STAGE_CONFIG.Unknown;
            return (
              <div key={stage}>
                <div className="flex justify-between items-baseline text-sm mb-1">
                  <span className="font-medium text-gray-700">{config.label}</span>
                  <span className="text-gray-500 font-semibold">{count}</span>
                </div>
                <div className="w-full bg-gray-200/70 rounded-full h-2">
                  <div
                    className={`${config.color} h-2 rounded-full`}
                    style={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-gray-500 mt-8 text-center">No sales funnel data to display.</p>
      )}
    </div>
  );
};

export default SalesFunnel;