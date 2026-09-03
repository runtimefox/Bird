import { axiosAuthMock, axiosResponse, resetAxiosMocks } from '../helpers/axios-mock';
import { resetToastMocks } from '../helpers/toast-mock';
import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { makeUser } from '../helpers/fixtures';
import { renderWithQuery } from '../helpers/query-wrapper';

const { ProfileSection } =
  await import('@/components/dashboard/settings/ProfileSection/ProfileSection');

const nameInput = () => screen.getByPlaceholderText('Your name') as HTMLInputElement;
const usernameInput = () => screen.getByPlaceholderText('@username') as HTMLInputElement;
const bioInput = () => screen.getByPlaceholderText('About you...') as HTMLTextAreaElement;

describe('ProfileSection', () => {
  beforeEach(() => {
    resetAxiosMocks();
    resetToastMocks();
  });

  it('fills the form from the profile once it arrives', async () => {
    axiosAuthMock.get.mockResolvedValue(
      axiosResponse(makeUser({ name: 'Ivan', username: 'ivan', bio: 'Hello' })),
    );
    renderWithQuery(<ProfileSection />);

    await waitFor(() => expect(nameInput().value).toBe('Ivan'));
    expect(usernameInput().value).toBe('ivan');
    expect(bioInput().value).toBe('Hello');
  });

  it('falls back to empty strings when the profile has no name or bio', async () => {
    axiosAuthMock.get.mockResolvedValue(
      axiosResponse(makeUser({ name: undefined, bio: undefined })),
    );
    renderWithQuery(<ProfileSection />);

    await waitFor(() => expect(usernameInput().value).toBe('ivan'));
    expect(nameInput().value).toBe('');
    expect(bioInput().value).toBe('');
  });

  it('keeps a field the user is editing when the profile refetches', async () => {
    axiosAuthMock.get.mockResolvedValue(axiosResponse(makeUser({ name: 'Ivan', bio: 'Old bio' })));
    const { client } = renderWithQuery(<ProfileSection />);

    await waitFor(() => expect(nameInput().value).toBe('Ivan'));
    await userEvent.clear(nameInput());
    await userEvent.type(nameInput(), 'Ivan Y');

    axiosAuthMock.get.mockResolvedValue(
      axiosResponse(makeUser({ name: 'Ivan', bio: 'Server bio' })),
    );
    await client.refetchQueries({ queryKey: ['profile'] });

    await waitFor(() => expect(bioInput().value).toBe('Server bio'));
    expect(nameInput().value).toBe('Ivan Y');
  });

  it('submits the edited fields as form data', async () => {
    axiosAuthMock.get.mockResolvedValue(axiosResponse(makeUser({ name: 'Ivan' })));
    renderWithQuery(<ProfileSection />);

    await waitFor(() => expect(nameInput().value).toBe('Ivan'));
    await userEvent.clear(nameInput());
    await userEvent.type(nameInput(), 'Ivan Y');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(axiosAuthMock.patch).toHaveBeenCalled());
    const body = axiosAuthMock.patch.mock.calls[0][1] as FormData;
    expect(body.get('name')).toBe('Ivan Y');
    expect(body.get('username')).toBe('ivan');
  });

  it('revokes the preview url when the form goes away', async () => {
    const revoke = mock<(url: string) => void>(() => undefined);
    const createObjectURL = mock<(file: Blob) => string>(() => 'blob:preview-1');
    const original = { create: URL.createObjectURL, revoke: URL.revokeObjectURL };
    URL.createObjectURL = createObjectURL as unknown as typeof URL.createObjectURL;
    URL.revokeObjectURL = revoke as unknown as typeof URL.revokeObjectURL;

    axiosAuthMock.get.mockResolvedValue(axiosResponse(makeUser()));
    const { unmount } = renderWithQuery(<ProfileSection />);

    await waitFor(() => expect(usernameInput().value).toBe('ivan'));
    const file = new File(['x'], 'avatar.png', { type: 'image/png' });
    await userEvent.upload(document.getElementById('avatar') as HTMLInputElement, file);

    await waitFor(() => expect(createObjectURL).toHaveBeenCalled());
    unmount();

    expect(revoke).toHaveBeenCalledWith('blob:preview-1');
    URL.createObjectURL = original.create;
    URL.revokeObjectURL = original.revoke;
  });
});
