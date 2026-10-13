// Reads the career timeline from src/timeline.yaml for the About page.
import { load } from 'js-yaml';
import text from '../timeline.yaml?raw';

export const TIMELINE_CATEGORIES = ['Education', 'Appointments', 'Research', 'Leadership', 'Recognition'] as const;

export type Milestone = {
  year: string;
  category: (typeof TIMELINE_CATEGORIES)[number];
  title: string;
  detail: string;
  link: string;
};

const raw = (load(text) ?? {}) as { milestones?: Record<string, unknown>[] };

export const milestones: Milestone[] = (raw.milestones ?? []).map((m, i) => {
  const category = String(m.category ?? '').trim();
  if (!(TIMELINE_CATEGORIES as readonly string[]).includes(category)) {
    throw new Error(
      `Milestone ${i + 1} in src/timeline.yaml has the category "${category}". Use one of: ${TIMELINE_CATEGORIES.join(', ')}.`
    );
  }
  if (!m.title) throw new Error(`Milestone ${i + 1} in src/timeline.yaml needs a "title".`);
  return {
    year: String(m.year ?? '').trim(),
    category: category as Milestone['category'],
    title: String(m.title).trim(),
    detail: m.detail ? String(m.detail).trim() : '',
    link: m.link ? String(m.link).trim() : '',
  };
});
