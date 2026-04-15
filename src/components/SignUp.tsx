import { useSignUp } from '@/hooks/useSignUp';
import type { FC } from 'react';

export const SignUp: FC = () => {
  const { register, handleSubmit, onSubmit } = useSignUp();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md p-8 bg-zinc-900 ">
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
          className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm placeholder:text-zinc-600 outline-none focus:border-zinc-600 focus:ring-2 focus:ring-white/5 transition"
          placeholder="john_doe"
          {...register('username', { required: true })}
        />
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
          className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm placeholder:text-zinc-600 outline-none focus:border-zinc-600 focus:ring-2 focus:ring-white/5 transition"
          placeholder="john@example.com"
          {...register('email', { required: true })}
        />
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
          className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm placeholder:text-zinc-600 outline-none focus:border-zinc-600 focus:ring-2 focus:ring-white/5 transition"
          placeholder="••••••••"
          {...register('password', { required: true })}
        />
      </div>

      <div className="flex flex-col gap-1.5 mb-8">
        <label
          htmlFor="name"
          className="text-xs font-medium text-zinc-400 uppercase tracking-widest"
        >
          Name{' '}
          <span className="text-zinc-600 normal-case tracking-normal font-normal">(optional)</span>
        </label>
        <input
          id="name"
          className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm placeholder:text-zinc-600 outline-none focus:border-zinc-600 focus:ring-2 focus:ring-white/5 transition"
          placeholder="John Doe"
          {...register('name')}
        />
      </div>

      <button
        type="submit"
        className="w-full py-2.5 bg-white text-black text-sm font-semibold rounded-lg hover:opacity-90 active:opacity-75 transition"
      >
        Register
      </button>
    </form>
  );
};
