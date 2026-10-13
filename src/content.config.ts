// The rules every piece of work must follow. If a required field is missing
// or spelled wrongly, the site will not build and the message below
// explains what to fix and where.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { loadSections, SECTION_KEYS } from './lib/site-config.mjs';

const sections = loadSections();

// Each piece of work is either a folder with an index.md inside
// (research/2026-sarcopenia-screening/index.md) or a single file
// (research/2026-sarcopenia-screening.md). Both become the web address
// /research/2026-sarcopenia-screening/
function idFromPath({ entry }: { entry: string }) {
  const parts = entry.replace(/\\/g, '/').split('/');
  const file = parts.pop() ?? '';
  const name = /^index\.mdx?$/i.test(file) && parts.length ? parts.pop()! : file.replace(/\.mdx?$/i, '');
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const requiredText = (field: string, hint: string) =>
  z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? `This piece of work needs a "${field}". Add a line starting with "${field}:" ${hint}.`
          : `"${field}" should be text. Put it inside double quotes if it contains a colon.`,
    })
    .trim()
    .min(1, { error: `"${field}" is empty. Write ${hint.replace(/^followed by /, '')}.` });

const optionalText = z.string().trim().optional();

const webAddress = (what: string) =>
  z.string({ error: `${what} must be text.` }).trim().refine((v) => /^(https?:\/\/|\.\/|\/|mailto:)/.test(v), {
    error: `${what} must be a full web address starting with https:// or a file in the same folder starting with ./`,
  });

function itemSchema(section: (typeof SECTION_KEYS)[number]) {
  const { title, categories } = sections[section];
  const categoryList = categories.map((c) => `"${c}"`).join(', ');

  return ({ image }: { image: () => z.ZodType }) => {
    const picture = (field: string) =>
      z
        .string({
          error: (issue) =>
            issue.input === undefined
              ? `This piece of work needs a "${field}" image. Add a line such as "${field}: ./cover.jpg" and put the photo in the same folder.`
              : `"${field}" should be the file name of a photo, such as ./cover.jpg`,
        })
        .pipe(image());

    return z.strictObject(
      {
        title: requiredText('title', 'followed by the title'),
        date: z.coerce.date({
          error: (issue) =>
            issue.input === undefined
              ? 'This piece of work needs a "date". Add a line such as "date: 2026-03-14" (year, month, day).'
              : `The date "${String(issue.input)}" is not understood. Write it as year-month-day, for example 2026-03-14.`,
        }),
        type: z.enum(categories as [string, ...string[]], {
          error: (issue) =>
            issue.input === undefined
              ? `This piece of work needs a "type". For the ${title} section, choose one of: ${categoryList}.`
              : `"${String(issue.input)}" is not one of the ${title} categories. Choose one of: ${categoryList}. Spelling and capital letters must match exactly. You can change the categories in src/sections.yaml.`,
        }),
        summary: requiredText('summary', 'followed by one or two sentences describing the work'),
        cover: picture('cover'),
        coverAlt: requiredText(
          'coverAlt',
          'followed by a short description of the cover photo for people who cannot see it'
        ),
        featured: z.boolean({ error: '"featured" must be either true or false.' }).default(false),
        collaboratorsLabel: optionalText,
        collaborators: z
          .array(
            z.union([
              z.string().trim().min(1),
              z.object({
                name: requiredText('name', 'followed by the person or organisation'),
                role: optionalText,
                affiliation: optionalText,
                url: optionalText,
              }),
            ]),
            { error: '"collaborators" should be a list, with each name on its own line starting with "- ".' }
          )
          .default([]),
        links: z
          .array(
            z.object({
              label: requiredText('label', 'followed by the link text, for example DOI or Slides'),
              url: webAddress('Each link'),
            }),
            { error: '"links" should be a list. Each link needs a "label" and a "url".' }
          )
          .default([]),
        gallery: z
          .array(
            z.object({
              image: picture('image'),
              alt: requiredText('alt', 'followed by a short description of the photo for people who cannot see it'),
              caption: optionalText,
            }),
            { error: '"gallery" should be a list of photos. Each photo needs an "image" and an "alt".' }
          )
          .default([]),
        video: z
          .object(
            {
              url: webAddress('The video "url"'),
              title: optionalText,
              poster: z
                .string()
                .pipe(image())
                .optional(),
            },
            { error: '"video" needs a "url" on the line below it, indented by two spaces.' }
          )
          .optional(),
      },
      {
        error: (issue) =>
          issue.code === 'unrecognized_keys'
            ? `The field ${issue.keys.map((k) => `"${k}"`).join(', ')} is not recognised. Check the spelling against the template in templates/new-work/index.md.`
            : undefined,
      }
    );
  };
}

function sectionCollection(section: (typeof SECTION_KEYS)[number]) {
  return defineCollection({
    loader: glob({
      base: `./src/content/${section}`,
      pattern: ['**/*.md', '!**/_*/**', '!**/_*.md'],
      generateId: idFromPath,
    }),
    schema: itemSchema(section),
  });
}

const about = defineCollection({
  loader: glob({ base: './src/content/about', pattern: 'index.md' }),
  schema: ({ image }) =>
    z.object({
      portrait: z
        .string({ error: 'The About page needs a "portrait". Add a line such as "portrait: ./portrait.jpg".' })
        .pipe(image()),
      portraitAlt: requiredText('portraitAlt', 'followed by a short description of the portrait'),
      cv: optionalText,
      positions: z
        .array(
          z.object({
            role: requiredText('role', 'followed by the job title'),
            place: requiredText('place', 'followed by the department or institution'),
          })
        )
        .default([]),
      education: z
        .array(
          z.object({
            degree: requiredText('degree', 'followed by the qualification'),
            place: requiredText('place', 'followed by the institution and year'),
          })
        )
        .default([]),
    }),
});

export const collections = {
  academic: sectionCollection('academic'),
  research: sectionCollection('research'),
  community: sectionCollection('community'),
  industry: sectionCollection('industry'),
  about,
};
