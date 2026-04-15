'use client';
import { FeedTabs } from '@/components/dashboard/FeedTabs';
import { CreatePost } from '@/components/dashboard/posts/create-post/CreatePost';
import { Posts } from '@/components/dashboard/posts/Posts';
import { useState, type FC } from 'react';

export const Home: FC = () => {
  const [activeTab, setActiveTab] = useState('For you');

  return (
    <div>
      <FeedTabs active={activeTab} onTabChange={setActiveTab} />
      <CreatePost />
      <Posts activeTab={activeTab} />
    </div>
  );
};
