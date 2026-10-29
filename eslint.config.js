import eslintPluginAstro from 'eslint-plugin-astro';

/** Flat Config (ESLint 9). Astro-Empfehlungen + jsx-a11y für .astro-Templates. */
export default [
  {
    ignores: ['dist/', '.vercel/', '.astro/', 'node_modules/', 'pnpm-lock.yaml'],
  },
  ...eslintPluginAstro.configs['flat/recommended'],
  ...eslintPluginAstro.configs['flat/jsx-a11y-recommended'],
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // role="list" auf <ul> ist absichtlich: sobald list-style:none gesetzt ist,
      // entfernt Safari mit VoiceOver die Listensemantik. role="list" stellt sie
      // wieder her (siehe reset.css: ul[role="list"]).
      'astro/jsx-a11y/no-redundant-roles': 'off',
    },
  },
];
