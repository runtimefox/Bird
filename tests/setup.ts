import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { afterEach, expect, mock } from 'bun:test';
import { createElement, type ReactNode } from 'react';

expect.extend(matchers);

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
