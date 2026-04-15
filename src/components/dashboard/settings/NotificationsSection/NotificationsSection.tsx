'use client';
import { useState, type FC } from 'react';

const NOTIFICATIONS = ['Likes', 'Comments', 'New followers', 'Mentions'];

export const NotificationsSection: FC = () => {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIFICATIONS.map((n) => [n, true])),
  );

  return (
    <div className="max-w-lg space-y-4">
      <h2 className="text-lg font-bold">Notifications</h2>
      {NOTIFICATIONS.map((item) => (
        <div key={item} className="flex justify-between items-center py-3 border-b border-border">
          <span className="text-sm">{item}</span>
          <button
            type="button"
            onClick={() => setEnabled((prev) => ({ ...prev, [item]: !prev[item] }))}
            className={`w-10 h-6 rounded-full transition-colors relative ${
              enabled[item] ? 'bg-blue-500' : 'bg-gray-600'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                enabled[item] ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>
      ))}
    </div>
  );
};
