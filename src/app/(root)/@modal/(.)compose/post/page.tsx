'use client';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import dynamic from 'next/dynamic';

const CreatePost = dynamic(
  () => import('@/components/dashboard/posts/create-post/CreatePost').then((mod) => mod.CreatePost),
  { ssr: false },
);

export default function ComposeModal() {
  const router = useRouter();
  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent className="max-w-xl!  p-0 bg-black border-border">
        <VisuallyHidden>
          <DialogTitle>Create Post</DialogTitle>
        </VisuallyHidden>
        <CreatePost onSuccess={() => router.back()} />
      </DialogContent>
    </Dialog>
  );
}
