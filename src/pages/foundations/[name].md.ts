/**
 * /foundations/<name>.md: Markdown-Fassung einer Foundation. Nötig, damit die
 * relativen Links in /llms.txt auch auf der Website auflösen.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { foundations } from '../../docs/site';
import { foundationMarkdown } from '../../docs/markdown';

export const getStaticPaths = (() =>
  foundations.map((f) => ({ params: { name: f.slug } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params }) =>
  new Response(foundationMarkdown(params.name as string), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
