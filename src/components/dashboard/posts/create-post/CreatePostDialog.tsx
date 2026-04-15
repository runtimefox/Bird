import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useState, type FC } from 'react';

export const CreatePostDialog: FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full rounded-full py-6 text-base font-chirp-bold bg-white text-black hover:bg-white/90">
          Create post
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl p-0 bg-black border-border"></DialogContent>
    </Dialog>
  );
};
