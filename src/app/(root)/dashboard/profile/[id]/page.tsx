import { ProfileUsers } from './ProfileUsers';

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProfileUsers id={id} />;
}
