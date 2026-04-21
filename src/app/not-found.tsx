import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-center p-8">
      <div>
        <p className="text-8xl font-bold text-white tracking-tighter">404</p>
        <p className="text-xl text-gray-500 mt-4">This page doesn't exist</p>
        <p className="text-sm text-gray-600 mt-1 mb-8">
          The page you're looking for has flown away.
        </p>
        <Link
          href="/dashboard/home"
          className="bg-white text-black px-6 py-2 rounded-full font-medium hover:opacity-85 transition-opacity"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
