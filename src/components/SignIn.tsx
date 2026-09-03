'use client';
import { useSignIn } from '@/hooks/useSignIn';
import type { FC } from 'react';
import { FieldError } from './FieldError';

export const SignIn: FC = () => {
  const inputCls: string =
    'w-full px-3 py-2 border border-zinc-700 rounded-lg text-zinc-400  text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
  const { handleSubmit, onSubmit, register, errors, isPending } = useSignIn();

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col gap-1.5 mb-5">
        <label
          htmlFor="email"
          className="text-xs font-medium text-zinc-400 uppercase tracking-widest"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          className={inputCls}
          placeholder="john@example.com"
          aria-invalid={!!errors.email}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /\S+@\S+\.\S+/, message: 'Enter a valid email' },
          })}
        />
        <FieldError message={errors.email?.message} />
      </div>

      <div className="flex flex-col gap-1.5 mb-8">
        <label
          htmlFor="password"
          className="text-xs font-medium text-zinc-400 uppercase tracking-widest"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          className={inputCls}
          placeholder="••••••••"
          aria-invalid={!!errors.password}
          {...register('password', { required: 'Password is required' })}
        />
        <FieldError message={errors.password?.message} />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2.5 bg-white text-black text-sm font-semibold rounded-lg hover:opacity-90 active:opacity-75 transition disabled:opacity-50"
      >
        {isPending ? 'Signing in...' : 'Login'}
      </button>
    </form>
  );
};
