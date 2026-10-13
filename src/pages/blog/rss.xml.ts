// The blog's RSS feed at /blog/rss.xml, so readers can follow new articles
// in a feed reader. Built from the same list as the Blog page, so drafts
// never appear on the published site.
import type { APIRoute } from 'astro';
import { plain } from '../../lib/placeholder.mjs';
import { settings } from '../../lib/items';
import { blog, getPosts, postUrl } from '../../lib/blog';

const xml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

export const GET: APIRoute = async ({ site }) => {
  const posts = await getPosts();
  const home = new URL('/blog/', site).href;
  const items = posts
    .slice(0, 50)
    .map((post) => {
      const url = new URL(postUrl(post), site).href;
      return [
        '<item>',
        `<title>${xml(plain(post.data.title))}</title>`,
        `<link>${url}</link>`,
        `<guid isPermaLink="true">${url}</guid>`,
        `<pubDate>${post.data.date.toUTCString()}</pubDate>`,
        `<description>${xml(plain(post.data.description))}</description>`,
        `<category>${xml(post.data.category)}</category>`,
        `<dc:creator>${xml(plain(post.data.author))}</dc:creator>`,
        '</item>',
      ].join('');
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
<channel>
<title>${xml(`${blog.title} | ${plain(settings.name)}`)}</title>
<link>${home}</link>
<description>${xml(blog.tagline)}</description>
<language>en-gb</language>
<atom:link href="${home}rss.xml" rel="self" type="application/rss+xml"/>
${posts[0] ? `<lastBuildDate>${(posts[0].data.updated ?? posts[0].data.date).toUTCString()}</lastBuildDate>` : ''}
${items}
</channel>
</rss>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
