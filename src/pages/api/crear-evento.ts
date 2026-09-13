import type { APIRoute } from 'astro';
import { Octokit } from 'octokit';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { title, description, imageUrl, inscriptionUrl, moreInfoUrl, date, slug } = data;

    if (!title || !slug) {
      return new Response(JSON.stringify({ error: 'Faltan campos obligatorios' }), { status: 400 });
    }

    const octokit = new Octokit({ auth: import.meta.env.GITHUB_TOKEN });
    const owner = import.meta.env.GITHUB_OWNER;
    const repo = import.meta.env.GITHUB_REPO;
    const path = `src/content/events/${slug}.md`;

    const fileContent = `---
title: "${title}"
date: "${date || new Date().toISOString()}"
imageUrl: "${imageUrl || ''}"
inscriptionUrl: "${inscriptionUrl || '#'}"
moreInfoUrl: "${moreInfoUrl || '#'}"
---

${description || ''}
`;

    const encodedContent = Buffer.from(fileContent, 'utf-8').toString('base64');

    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner,
      repo,
      path,
      message: `feat(events): añadir nuevo evento deportivo ${slug}`,
      content: encodedContent,
      branch: 'main',
    });

    return new Response(JSON.stringify({ success: true, message: 'Evento guardado en GitHub con éxito.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
