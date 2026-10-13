import { getCollection, type CollectionEntry } from 'astro:content';
import { parseSettings, parseSections, SECTION_KEYS } from './site-config.mjs';
import settingsText from '../settings.yaml?raw';
import sectionsText from '../sections.yaml?raw';

export type SectionKey = (typeof SECTION_KEYS)[number];
export type Item = CollectionEntry<SectionKey>;

export const settings = parseSettings(settingsText);
export const sections = parseSections(sectionsText) as Record<
  SectionKey,
  { key: SectionKey; title: string; description: string; categories: string[] }
>;
export const sectionKeys = SECTION_KEYS as unknown as SectionKey[];

const byNewest = (a: Item, b: Item) => b.data.date.getTime() - a.data.date.getTime();

export async function getItems(section: SectionKey): Promise<Item[]> {
  return (await getCollection(section)).sort(byNewest);
}

export async function getAllItems(): Promise<Item[]> {
  const lists = await Promise.all(sectionKeys.map((key) => getItems(key)));
  return lists.flat().sort(byNewest);
}

export async function getFeatured(limit = 6): Promise<Item[]> {
  return (await getAllItems()).filter((item) => item.data.featured).slice(0, limit);
}

export function itemUrl(item: Item) {
  return `/${item.collection}/${item.id}/`;
}

export function formatDate(date: Date, style: 'long' | 'month' = 'long') {
  return new Intl.DateTimeFormat('en-GB', {
    day: style === 'long' ? 'numeric' : undefined,
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];
export const roman = (index: number) => ROMAN[index] ?? String(index + 1);

// Videos, PDFs and other files kept in the same folder as a piece of work.
// They are found here so that "./clip.mp4" in a Markdown file becomes a
// working web address.
const localFiles = import.meta.glob('/src/content/**/*.{mp4,webm,m4v,pdf,docx,pptx}', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export function resolveLocalFile(entryFilePath: string | undefined, ref: string): string {
  if (!/^\.\.?\//.test(ref)) return ref;
  const folder = '/' + (entryFilePath ?? '').replace(/\\/g, '/').replace(/[^/]+$/, '');
  const parts = (folder + ref).split('/');
  const resolved: string[] = [];
  for (const part of parts) {
    if (part === '..') resolved.pop();
    else if (part !== '.' && part !== '') resolved.push(part);
  }
  const key = '/' + resolved.join('/');
  const url = localFiles[key];
  if (!url) {
    throw new Error(
      `The file "${ref}" mentioned in ${entryFilePath} could not be found. ` +
        'Check the spelling of the file name and that the file is in the same folder as the Markdown file.'
    );
  }
  return url;
}

export type VideoSource =
  | { kind: 'youtube'; id: string; embed: string; watch: string }
  | { kind: 'vimeo'; id: string; embed: string; watch: string }
  | { kind: 'file'; src: string };

export function parseVideo(url: string, entryFilePath?: string): VideoSource {
  const trimmed = url.trim();
  const yt =
    trimmed.match(/youtu\.be\/([\w-]+)/) ||
    trimmed.match(/youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)([\w-]+)/);
  if (yt) {
    const id = yt[1];
    return {
      kind: 'youtube',
      id,
      embed: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`,
      watch: `https://www.youtube.com/watch?v=${id}`,
    };
  }
  const vm = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/(\w+))?/);
  if (vm) {
    const [, id, hash] = vm;
    const h = hash ? `&h=${hash}` : '';
    return {
      kind: 'vimeo',
      id,
      embed: `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1${h}`,
      watch: `https://vimeo.com/${id}${hash ? `/${hash}` : ''}`,
    };
  }
  if (/^\.\.?\//.test(trimmed) || /\.(mp4|webm|m4v)$/i.test(trimmed)) {
    return { kind: 'file', src: resolveLocalFile(entryFilePath, trimmed) };
  }
  throw new Error(
    `The video link "${url}" in ${entryFilePath} is not recognised. ` +
      'Use a YouTube or Vimeo address, or a short MP4 file in the same folder written as ./my-clip.mp4'
  );
}
