/**
 * /llms.txt: Index der maschinenlesbaren Fassung. Statisch erzeugt; den
 * Content-Type text/plain setzt vercel.json, ein statischer Endpunkt kann
 * keine Header mitgeben.
 */
import type { APIRoute } from 'astro';
import { llmsTxt } from '../docs/markdown';

export const GET: APIRoute = async () =>
  new Response(await llmsTxt(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
