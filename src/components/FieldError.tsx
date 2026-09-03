import type { FC } from 'react';

interface IFieldErrorProps {
  message?: string;
}

export const FieldError: FC<IFieldErrorProps> = ({ message }) =>
  message ? (
    <p role="alert" className="text-xs text-red-400">
      {message}
    </p>
  ) : null;
