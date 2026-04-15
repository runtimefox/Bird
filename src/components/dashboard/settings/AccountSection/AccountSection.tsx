import { Button } from '@/components/ui/button';

export const AccountSection = () => (
  <div className="max-w-lg space-y-4">
    <h2 className="text-lg font-bold">Account</h2>
    <div>
      <label className="text-sm text-gray-400">Email</label>
      <input
        type="email"
        className="w-full mt-1 bg-transparent border border-border rounded-lg p-2"
        placeholder="email@example.com"
      />
    </div>
    <div>
      <label className="text-sm text-gray-400">New password</label>
      <input
        type="password"
        className="w-full mt-1 bg-transparent border border-border rounded-lg p-2"
        placeholder="••••••••"
      />
    </div>
    <Button className="rounded-full px-6 py-2 bg-white text-black font-bold text-sm">Save</Button>
  </div>
);
