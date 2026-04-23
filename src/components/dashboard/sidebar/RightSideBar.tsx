'use client';
import { useDebounce } from '@/hooks/useDebounce';
import { userService } from '@/services/user.service';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, type FC } from 'react';

export const RightSideBar: FC = () => {
  const [query, setQuery] = useState('');
  const debounce = useDebounce(query, 500);
  const { data, isLoading } = useQuery({
    queryKey: ['search', debounce],
    queryFn: () => userService.searchUsers(debounce),
    enabled: debounce.length > 0,
  });

  return (
    <div className="p-4 space-y-4">
      {/* Поиск */}
      <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
        <Search size={16} className="text-gray-500 shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="bg-transparent outline-none text-sm w-full"
        />
      </div>

      {debounce.length > 0 && (
        <div className="bg-white/5 rounded-2xl overflow-hidden">
          {isLoading && <div className="p-4 text-gray-500 text-sm">Searching...</div>}
          {!isLoading && data?.data.length === 0 && (
            <div className="p-4 text-gray-500 text-sm">No users found</div>
          )}
          {data?.data.map((user) => (
            <Link href={`/dashboard/profile/${user.id}`} key={user.id}>
              <div className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors cursor-pointer">
                <Image
                  src={user.avatar ?? '/profile.png'}
                  width={40}
                  height={40}
                  className="rounded-full w-10 h-10 object-cover shrink-0"
                  alt="avatar"
                />
                <div>
                  <p className="font-chirp-bold text-sm">{user.name ?? user.username}</p>
                  <p className="text-gray-500 text-xs">@{user.username}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
