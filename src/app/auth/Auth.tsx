'use client';
import { SignIn } from '@/components/SignIn';
import { SignUp } from '@/components/SignUp';
import { Heading } from '@/components/ui/heading';
import { useState, type FC } from 'react';
export const Auth: FC = () => {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <div className="w-full max-w-md m-auto bg-zinc-900 rounded-2xl shadow-2xl px-8 py-8">
        <Heading title="Authentication" />

        {isLogin ? <SignIn /> : <SignUp />}

        <button
          onClick={() => setIsLogin((prev) => !prev)}
          className="mt-4 w-full text-sm text-zinc-500 hover:text-zinc-300 transition text-center"
        >
          {isLogin ? 'Create an account' : 'Already have an account?'}
        </button>
      </div>
    </div>
  );
};
