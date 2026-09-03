import { describe, expect, it } from 'bun:test';
import { cn } from '@/lib/utils';

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('flex', 'gap-2')).toBe('flex gap-2');
  });

  it('lets the last conflicting Tailwind utility win', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
    expect(cn('text-gray-500', 'text-white')).toBe('text-white');
  });

  it('drops falsy values', () => {
    expect(cn('flex', false, undefined, null, '')).toBe('flex');
  });

  it('supports conditional object syntax', () => {
    expect(cn('base', { active: true, hidden: false })).toBe('base active');
  });

  it('keeps non-conflicting utilities from different groups', () => {
    expect(cn('px-2', 'py-4')).toBe('px-2 py-4');
  });
});
