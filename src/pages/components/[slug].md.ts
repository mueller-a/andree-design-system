/** /components/<slug>.md: Markdown-Fassung einer dokumentierten Komponente. */
import type { APIRoute, GetStaticPaths } from 'astro';
import { documentedComponents } from '../../docs/components';
import { componentMarkdown } from '../../docs/markdown';

export const getStaticPaths = (async () => {
  const docs = await documentedComponents();
  return docs.map((doc) => ({ params: { slug: doc.data.slug }, props: { doc } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) =>
  new Response(await componentMarkdown(props.doc), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
