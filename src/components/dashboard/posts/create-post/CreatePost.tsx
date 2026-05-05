'use client';
import Image from 'next/image';
import { X } from 'lucide-react';
import type { FC } from 'react';
import { useCreatePost } from '@/hooks/useCreatePost';
import { PostActions } from './PostActions';
import { Button } from '@/components/ui/button';
import { Controller } from 'react-hook-form';

interface Props {
  onSuccess?: () => void;
}

export const CreatePost: FC<Props> = ({ onSuccess }) => {
  const {
    handleSubmit,
    onSubmit,
    text,
    isPending,
    preview,
    setPreview,
    setFile,
    handleFile,
    user,
    setValue,
    control,
  } = useCreatePost(onSuccess);

  const handleEmojiClick = (emoji: string) => {
    setValue('content', (text ?? '') + emoji, { shouldDirty: true });
  };
  return (
    <div className="border-b border-border p-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-3">
          <Image
            src={user?.data?.avatar ?? '/profile.png'}
            className="rounded-full w-10 h-10"
            width={40}
            height={40}
            alt="avatar"
          />
          <div className="flex-1">
            <Controller
              control={control}
              name="content"
              render={({ field }) => (
                <textarea
                  {...field}
                  placeholder="What's going on?"
                  className="w-full bg-transparent text-xl placeholder:text-gray-500 outline-none resize-none min-h-15"
                />
              )}
            />
            {preview && (
              <div className="relative mt-2">
                <Image
                  width={500}
                  height={300}
                  src={preview}
                  unoptimized
                  className="rounded-xl max-h-80 w-full object-cover"
                  alt="preview"
                />
                <Button
                  type="button"
                  onClick={() => {
                    setPreview(null);
                    setFile(null);
                  }}
                  className="absolute top-2 right-2 bg-black/50 rounded-full p-1"
                >
                  <X size={16} />
                </Button>
              </div>
            )}
            <PostActions
              onFileChange={handleFile}
              disabled={!text || isPending}
              isPending={isPending}
              onEmojiClick={handleEmojiClick}
            />
          </div>
        </div>
      </form>
    </div>
  );
};
