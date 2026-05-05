import { ImagePlus, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, type FC } from 'react';
import EmojiPicker, { type EmojiClickData } from 'emoji-picker-react';
import { Theme } from 'emoji-picker-react';

interface Props {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmojiClick: (emoji: string) => void;
  disabled: boolean;
  isPending: boolean;
}

export const PostActions: FC<Props> = ({ onFileChange, onEmojiClick, disabled, isPending }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (emoji: EmojiClickData) => {
    onEmojiClick(emoji.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="flex items-center justify-between mt-2 relative">
      <div className="flex gap-3 text-white-400">
        <label htmlFor="upload" className="cursor-pointer hover:opacity-70">
          <ImagePlus size={20} />
        </label>
        <input
          type="file"
          accept="image/*"
          id="upload"
          className="hidden"
          onChange={onFileChange}
        />
        <button
          type="button"
          onClick={() => {
            console.log('emoji');
            setShowEmojiPicker((prev) => !prev);
          }}
          className="hover:opacity-70"
        >
          <Smile size={20} className="cursor-pointer hover:opacity-70" />
        </button>
      </div>

      {showEmojiPicker && (
        <div className="absolute z-10">
          <EmojiPicker onEmojiClick={handleEmojiClick} theme={Theme.DARK} />
        </div>
      )}

      <Button
        type="submit"
        disabled={disabled}
        className="rounded-full px-5 font-chirp-bold bg-white text-black hover:bg-white/90"
      >
        {isPending ? 'Posting...' : 'Make post'}
      </Button>
    </div>
  );
};
