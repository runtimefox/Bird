'use client';
import { Search } from 'lucide-react';
import Image from 'next/image';
import { type FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/useDebounce';
import { userService } from '@/services/user.service';

interface INewChatProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelect: (userId: string) => void;
}

export const NewChat: FC<INewChatProps> = ({ searchQuery, setSearchQuery, onSelect }) => {
  const debounce = useDebounce(searchQuery, 500);
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['search', debounce],
    queryFn: () => userService.searchUsers(debounce),
    enabled: debounce.length > 0,
  });

  return (
    <div className="flex flex-col gap-2 flex-1">
      <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
        <Search size={16} className="text-gray-500 shrink-0" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users..."
          className="bg-transparent outline-none text-sm w-full"
          autoFocus
        />
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {isLoading && <p className="text-gray-500 text-sm p-2">Searching...</p>}
        {searchResults?.data.map((u) => (
          <div
            key={u.id}
            onClick={() => onSelect(u.id)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
          >
            <Image
              src={u.avatar ?? '/profile.png'}
              width={36}
              height={36}
              className="rounded-full w-9 h-9 object-cover shrink-0"
              alt="avatar"
            />
            <div>
              <p className="text-sm font-chirp-bold">{u.name ?? u.username}</p>
              <p className="text-xs text-gray-500">@{u.username}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
