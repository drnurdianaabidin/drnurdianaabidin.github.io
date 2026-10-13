// Everything the blog pages need: the settings from src/blog.yaml, the list
// of articles (without drafts on the published site), reading times, covers,
// topics and related articles.
import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { parseBlog, topicSlug } from './site-config.mjs';
import { ILLUSTRATION_ALT } from './illustrations';
import { settings } from './items';
import blogText from '../blog.yaml?raw';

export type Post = CollectionEntry<'blog'>;
export type Topic = ReturnType<typeof parseBlog>['categories'][number];

export const blog = parseBlog(blogText);

/**
 * Drafts appear only while previewing on your own computer (npm run dev), or
 * in a build started with BLOG_DRAFTS=show. The published site never has them:
 * no page, no listing, no RSS entry and no sitemap entry.
 */
export const showDrafts = import.meta.env.DEV || process.env.BLOG_DRAFTS === 'show';

const byNewest = (a: Post, b: Post) => b.data.date.getTime() - a.data.date.getTime();

/** Articles visitors can read, newest first. */
export async function getPosts(): Promise<Post[]> {
  return (await getCollection('blog', (post) => showDrafts || !post.data.draft)).sort(byNewest);
}

export const postUrl = (post: Post) => `/blog/${post.id}/`;
export const topicUrl = (name: string) => `/blog/topic/${topicSlug(name)}/`;
export const topicOf = (name: string): Topic => blog.categories.find((c) => c.name === name) ?? blog.categories[0];

/** Topics that have at least one article, in the order of src/blog.yaml. */
export function topicsWithPosts(posts: Post[]) {
  return blog.categories
    .map((topic) => ({ ...topic, count: posts.filter((p) => p.data.category === topic.name).length }))
    .filter((topic) => topic.count > 0);
}

/** The featured article: the newest one marked featured, otherwise the newest. */
export function featuredPost(posts: Post[]) {
  return posts.find((p) => p.data.featured) ?? posts[0];
}

/** Estimated minutes to read, from the words in the article. */
export function readingTime(post: Post) {
  const text = (post.body ?? '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[\^[^\]]+\]:?/g, ' ');
  const words = text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
  return Math.max(1, Math.round(words / blog.wordsPerMinute));
}

const defaultCovers = import.meta.glob<ImageMetadata>('../assets/blog/*.jpg', { eager: true, import: 'default' });

/**
 * The cover of an article: its own photo, or the drawing for its topic.
 * Drawings are labelled as conceptual illustrations wherever they appear.
 */
export function coverOf(post: Post): { src: ImageMetadata; alt: string; illustration: boolean } {
  if (post.data.cover) return { src: post.data.cover, alt: post.data.coverAlt ?? '', illustration: false };
  const name = topicOf(post.data.category).image;
  const src = defaultCovers[`../assets/blog/${name}.jpg`] ?? defaultCovers['../assets/blog/fibres.jpg'];
  return { src, alt: ILLUSTRATION_ALT[name] ?? '', illustration: true };
}

/**
 * Other articles on the same topic or with the same tags, best match first.
 * Only articles in the list given are suggested, so drafts never are.
 */
export function relatedPosts(post: Post, posts: Post[], limit = 3) {
  const tags = new Set(post.data.tags.map((t) => t.toLowerCase()));
  return posts
    .filter((other) => other.id !== post.id)
    .map((other) => ({
      other,
      score:
        (other.data.category === post.data.category ? 2 : 0) +
        other.data.tags.filter((t) => tags.has(t.toLowerCase())).length,
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || byNewest(a.other, b.other))
    .slice(0, limit)
    .map((r) => r.other);
}

/** The path of a link to this site, such as /research/2021-osteosarcopenia-cut-off-values/ */
function sitePath(href: string) {
  const local = href.startsWith(settings.siteUrl) ? href.slice(settings.siteUrl.length) || '/' : href;
  if (!local.startsWith('/')) return '';
  const path = local.split(/[?#]/)[0];
  return path.endsWith('/') ? path : `${path}/`;
}

/** Articles that list a page of this site among their related links. */
export async function postsLinkingTo(path: string) {
  return (await getPosts()).filter((post) => post.data.related.some((link) => sitePath(link.href) === path));
}

/** The text of an article for the search box: title, description, topic and tags. */
export const searchText = (post: Post) =>
  [post.data.title, post.data.subtitle, post.data.description, post.data.category, ...post.data.tags]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
