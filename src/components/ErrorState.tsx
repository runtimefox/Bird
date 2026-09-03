'use client';
import { errorCatch } from '@/api/error';
import { RotateCw } from 'lucide-react';
import type { FC } from 'react';

interface IErrorStateProps {
  error: unknown;
  onRetry?: () => void;
  title?: string;
}

export const ErrorState: FC<IErrorStateProps> = ({
  error,
  onRetry,
  title = "That didn't load",
}) => (
  <div role="alert" className="p-8 flex flex-col items-center justify-center text-center gap-2">
    <p className="font-chirp-bold">{title}</p>
    <p className="text-gray-500 text-sm">{errorCatch(error)}</p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="mt-2 flex items-center gap-2 border border-border text-sm font-chirp-bold px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
      >
        <RotateCw size={14} />
        Try again
      </button>
    )}
  </div>
);
