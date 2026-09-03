import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { afterEach, expect, mock } from 'bun:test';
import { createElement, type ReactNode } from 'react';

expect.extend(matchers);

// React Testing Library runs effects through act().
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

afterEach(cleanup);

type NextImageProps = {
  src: string;
  alt?: string;
  fill?: boolean;
  priority?: boolean;
  unoptimized?: boolean;
  sizes?: string;
  [key: string]: unknown;
};

// next/image needs the Next image loader/config at runtime, and next/link needs a
// mounted App Router. Neither exists in a unit test, so both render as plain tags.
mock.module('next/image', () => ({
  default: ({ fill, priority, unoptimized, sizes, ...props }: NextImageProps) =>
    createElement('img', props),
}));

type NextLinkProps = {
  href: string;
  children?: ReactNode;
  [key: string]: unknown;
};

mock.module('next/link', () => ({
  default: ({ href, children, ...props }: NextLinkProps) =>
    createElement('a', { href, ...props }, children),
}));
