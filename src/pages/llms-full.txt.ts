/** /llms-full.txt: Index, alle Foundations und alle Komponenten in einer Datei. */
import type { APIRoute } from 'astro';
import { llmsFullTxt } from '../docs/markdown';

export const GET: APIRoute = async () =>
  new Response(await llmsFullTxt(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
