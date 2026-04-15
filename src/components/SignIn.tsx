import { useSignIn } from '@/hooks/useSignIn';
import type { FC } from 'react';

export const SignIn: FC = () => {
  const inputCls: string =
    'w-full px-3 py-2 border border-zinc-700 rounded-lg text-zinc-400  text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
  const { handleSubmit, onSubmit, register } = useSignIn();
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
          {...register('email', { required: true })}
        />
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
          {...register('password', { required: true })}
        />
      </div>

      <button
        type="submit"
        className="w-full py-2.5 bg-white text-black text-sm font-semibold rounded-lg hover:opacity-90 active:opacity-75 transition"
      >
        Login
      </button>
    </form>
  );
};
