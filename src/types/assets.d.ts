/**
 * Next 16 no longer ships an ambient declaration for stylesheet imports, so
 * `import './globals.css'` has no type to resolve to. `tsc` stays quiet because
 * `noUncheckedSideEffectImports` is off by default, but editors that enable it
 * report TS2882 on the import in `app/layout.tsx`.
 */
declare module '*.css';
