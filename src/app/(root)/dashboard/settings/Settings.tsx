'use client';
import { AccountSection } from '@/components/dashboard/settings/AccountSection/AccountSection';
import { NotificationsSection } from '@/components/dashboard/settings/NotificationsSection/NotificationsSection';
import { ProfileSection } from '@/components/dashboard/settings/ProfileSection/ProfileSection';
import { SecuritySection } from '@/components/dashboard/settings/SecuritySection/SecuritySection';
import { SECTIONS } from '@/config/sections.config';
import { useState, type FC } from 'react';

export const Settings: FC = () => {
  const [active, setActive] = useState('profile');
  return (
    <div className="flex min-h-screen">
      <div className="w-64 border-r border-border">
        <h1 className="text-xl font-bold p-4 border-b border-border">Settings</h1>
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => setActive(section.id)}
            className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-white/5 ${
              active === section.id ? 'font-bold bg-white/5' : 'text-gray-400'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      <div className="flex-1 p-6">
        {active === 'profile' && <ProfileSection />}
        {active === 'account' && <AccountSection />}
        {active === 'notifications' && <NotificationsSection />}
        {active === 'security' && <SecuritySection />}
      </div>
    </div>
  );
};
