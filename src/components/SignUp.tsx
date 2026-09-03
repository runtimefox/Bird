'use client';
import { useSignUp } from '@/hooks/useSignUp';
import type { FC } from 'react';
import { FieldError } from './FieldError';

const inputCls =
  'px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm placeholder:text-zinc-600 outline-none focus:border-zinc-600 focus:ring-2 focus:ring-white/5 transition';

export const SignUp: FC = () => {
  const { register, handleSubmit, onSubmit, errors, isPending } = useSignUp();

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full max-w-md p-8 bg-zinc-900 ">
      <h2 className="text-2xl font-semibold text-white tracking-tight mb-8">Create account</h2>

      <div className="flex flex-col gap-1.5 mb-5">
        <label
          htmlFor="username"
          className="text-xs font-medium text-zinc-400 uppercase tracking-widest"
        >
          Username
        </label>
        <input
          id="username"
          className={inputCls}
          placeholder="john_doe"
          aria-invalid={!!errors.username}
          {...register('username', {
            required: 'Username is required',
            minLength: { value: 3, message: 'At least 3 characters' },
          })}
        />
        <FieldError message={errors.username?.message} />
      </div>

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

      <div className="flex flex-col gap-1.5 mb-5">
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
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'At least 6 characters' },
          })}
        />
        <FieldError message={errors.password?.message} />
      </div>

      <div className="flex flex-col gap-1.5 mb-8">
        <label
          htmlFor="name"
          className="text-xs font-medium text-zinc-400 uppercase tracking-widest"
        >
          Name{' '}
          <span className="text-zinc-600 normal-case tracking-normal font-normal">(optional)</span>
        </label>
        <input id="name" className={inputCls} placeholder="John Doe" {...register('name')} />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2.5 bg-white text-black text-sm font-semibold rounded-lg hover:opacity-90 active:opacity-75 transition disabled:opacity-50"
      >
        {isPending ? 'Creating account...' : 'Register'}
      </button>
    </form>
  );
};
