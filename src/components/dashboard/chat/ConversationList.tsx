import { MessageSquareMoreIcon } from 'lucide-react';
import type { FC } from 'react';

interface IConversationListProps {
  toggleChat: () => void;
  isOpenChat: boolean;
}

export const ConversationList: FC<IConversationListProps> = ({ toggleChat, isOpenChat }) => {
  return (
    <div className="mt-auto relative flex justify-end">
      <button onClick={toggleChat} className="hover:opacity-80 transition-opacity">
        <MessageSquareMoreIcon width={'35px'} height={'35px'} />
      </button>

      <div
        className={`absolute bottom-0 right-0 w-88 h-113 bg-[#1a1a1a] border border-white/10 rounded-lg p-4
        transition-all duration-300 origin-bottom-right z-50 shadow-2xl
        ${
          isOpenChat
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <h2 className="text-lg font-chirp-bold mb-4 text-white">Chat</h2>
      </div>
    </div>
  );
};
