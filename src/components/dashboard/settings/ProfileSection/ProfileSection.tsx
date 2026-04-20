'use client';
import { Button } from '@/components/ui/button';
import { useGetProfile } from '@/hooks/useGetProfile';
import { useInitialData } from '@/hooks/useInitialData';
import { useSettings } from '@/hooks/useSettings';
import type { TypeUserForm } from '@/types/auth.type';
import Image from 'next/image';
import { useState, type FC } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

export const ProfileSection: FC = () => {
  const { mutate, isPending } = useSettings();
  const { data: user } = useGetProfile();
  const { register, handleSubmit, reset } = useForm<TypeUserForm>();

  useInitialData(reset);
  const [preview, setPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit: SubmitHandler<TypeUserForm> = (data) => {
    const formData = new FormData();

    formData.append('name', data.name as string);
    formData.append('username', data.username as string);
    formData.append('bio', data.bio as string);
    if (avatarFile) formData.append('avatar', avatarFile);

    mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-4">
      <h2 className="text-lg font-chirp-bold">Profile</h2>

      <div className="flex items-center gap-4">
        <label htmlFor="avatar" className="cursor-pointer">
          <Image
            src={preview ?? user?.data.avatar ?? '/profile.png'}
            width={72}
            height={72}
            unoptimized={!!preview}
            className="rounded-full w-18 h-18 object-cover border border-border hover:opacity-80 transition-opacity"
            alt="avatar"
          />
        </label>
        <input type="file" accept="image/*" id="avatar" className="hidden" onChange={handleFile} />
        <span className="text-sm text-gray-400">Click to change photo</span>
      </div>

      <div>
        <label className="text-sm text-gray-400">Name</label>
        <input
          {...register('name')}
          className="w-full mt-1 bg-transparent border border-border rounded-lg p-2"
          placeholder="Your name"
        />
      </div>
      <div>
        <label className="text-sm text-gray-400">Username</label>
        <input
          {...register('username')}
          className="w-full mt-1 bg-transparent border border-border rounded-lg p-2"
          placeholder="@username"
        />
      </div>
      <div>
        <label className="text-sm text-gray-400">Bio</label>
        <textarea
          {...register('bio')}
          className="w-full mt-1 bg-transparent border border-border rounded-lg p-2 resize-none h-20"
          placeholder="About you..."
        />
      </div>
      <Button
        type="submit"
        disabled={isPending}
        className="rounded-full px-6 bg-white text-black font-chirp-bold hover:bg-white/90"
      >
        {isPending ? 'Saving...' : 'Save'}
      </Button>
    </form>
  );
};
