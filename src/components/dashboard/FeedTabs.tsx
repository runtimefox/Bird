import type { FC } from 'react';

const TABS = ['For you', 'Following'];

interface IFeedTabsProps {
  active: string;
  onTabChange: (tab: string) => void;
}

export const FeedTabs: FC<IFeedTabsProps> = ({ active, onTabChange }) => {
  return (
    <div className="flex border-b border-border mb-4">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`flex-1 py-3 text-sm transition-colors ${
            active === tab
              ? 'font-chirp-bold border-b-2 border-white'
              : 'font-chirp-regular text-gray-500'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};
