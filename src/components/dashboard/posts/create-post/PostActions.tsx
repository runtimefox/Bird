import {
  AlignLeft,
  Calendar,
  FileText,
  Flag,
  ImagePlus,
  MapPin,
  RefreshCw,
  Smile,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { FC } from 'react';

interface Props {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  isPending: boolean;
}

export const PostActions: FC<Props> = ({ onFileChange, disabled, isPending }) => (
  <div className="flex items-center justify-between mt-2">
    <div className="flex gap-3 text-blue-400">
      <label htmlFor="upload" className="cursor-pointer hover:opacity-70">
        <ImagePlus size={20} />
      </label>
      <input type="file" accept="image/*" id="upload" className="hidden" onChange={onFileChange} />
      <FileText size={20} className="cursor-pointer hover:opacity-70" />
      <RefreshCw size={20} className="cursor-pointer hover:opacity-70" />
      <AlignLeft size={20} className="cursor-pointer hover:opacity-70" />
      <Smile size={20} className="cursor-pointer hover:opacity-70" />
      <Calendar size={20} className="cursor-pointer hover:opacity-70" />
      <MapPin size={20} className="cursor-pointer hover:opacity-70" />
      <Flag size={20} className="cursor-pointer hover:opacity-70" />
    </div>
    <Button
      type="submit"
      disabled={disabled}
      className="rounded-full px-5 font-bold bg-white text-black hover:bg-white/90"
    >
      {isPending ? 'Posting...' : 'Make post'}
    </Button>
  </div>
);
