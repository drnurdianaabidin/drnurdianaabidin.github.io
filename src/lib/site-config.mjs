// Reads src/settings.yaml and src/sections.yaml, checks them, and explains
// any mistakes in plain English. Used by astro.config.mjs, the content
// schema and the pages, so every part of the site reads the same values.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { load as parseYaml } from 'js-yaml';

export const SECTION_KEYS = ['academic', 'research', 'community', 'industry'];

const settingsPath = resolve(process.cwd(), 'src/settings.yaml');
const sectionsPath = resolve(process.cwd(), 'src/sections.yaml');

function readFile(path, label) {
  try {
    return readFileSync(path, 'utf8');
  } catch {
    throw new Error(`The file ${label} is missing. It should be at ${path}.`);
  }
}

function readYaml(text, label) {
  try {
    return parseYaml(text) ?? {};
  } catch (err) {
    const line = err.mark ? ` near line ${err.mark.line + 1}` : '';
    throw new Error(
      `There is a formatting problem in ${label}${line}. ` +
        'Check that each line has the form "name: value", that lists start with "- ", ' +
        'and that the spacing at the start of each line matches the lines around it.'
    );
  }
}

function requireText(obj, key, label, where) {
  const value = obj?.[key];
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${label} is missing in ${where}. Add a line starting with "${key}:" followed by the text.`);
  }
  return value.trim();
}

export function parseSettings(text) {
  const raw = readYaml(text, 'src/settings.yaml');
  const where = 'src/settings.yaml';
  const siteUrl = requireText(raw, 'siteUrl', 'The web address (siteUrl)', where).replace(/\/+$/, '');
  if (!/^https?:\/\//.test(siteUrl)) {
    throw new Error(`The siteUrl in ${where} must start with https:// (for example https://drnurdianaabidin.github.io).`);
  }
  const affiliations = Array.isArray(raw.affiliations) ? raw.affiliations.map(String) : [];
  // The tagline is a list of short phrases, or one line with the phrases separated by |
  const tagline = (Array.isArray(raw.tagline) ? raw.tagline : String(raw.tagline ?? '').split('|'))
    .map((t) => String(t).trim())
    .filter(Boolean);
  if (tagline.length === 0) {
    throw new Error(`The tagline is missing in ${where}. Add a line starting with "tagline:" followed by a list of short phrases.`);
  }
  const profiles = (Array.isArray(raw.profiles) ? raw.profiles : []).map((p, i) => {
    if (!p || typeof p !== 'object' || !p.label) {
      throw new Error(`Profile number ${i + 1} in ${where} needs a "label", for example "label: ORCID".`);
    }
    return {
      label: String(p.label).trim(),
      value: p.value ? String(p.value).trim() : '',
      url: p.url ? String(p.url).trim() : '',
    };
  });
  const optional = (key) => (typeof raw[key] === 'string' ? raw[key].trim() : '');
  return {
    name: requireText(raw, 'name', 'Your name', where),
    shortName: requireText(raw, 'shortName', 'The short form of your name (shortName)', where),
    siteTitle: optional('siteTitle'),
    institution: requireText(raw, 'institution', 'The institution', where),
    affiliations,
    tagline,
    introduction: optional('introduction'),
    description: requireText(raw, 'description', 'The site description', where),
    email: requireText(raw, 'email', 'The email address', where),
    contactNote: optional('contactNote'),
    profiles,
    siteUrl,
    highlightPlaceholders: raw.highlightPlaceholders !== false,
  };
}

// An optional block shown at the top of a section page, such as research themes.
function parseOverview(o, key, where) {
  if (o === undefined || o === null) return undefined;
  if (typeof o !== 'object') {
    throw new Error(`The "overview" of the "${key}" section in ${where} should have a "heading" and "groups" on the lines below it.`);
  }
  const groups = (Array.isArray(o.groups) ? o.groups : []).map((g) => ({
    title: g && g.title ? String(g.title).trim() : '',
    items: (Array.isArray(g?.items) ? g.items : []).map((i) => String(i).trim()).filter(Boolean),
  }));
  return {
    heading: requireText(o, 'heading', `The overview heading of the "${key}" section`, where),
    text: typeof o.text === 'string' ? o.text.trim() : '',
    note: typeof o.note === 'string' ? o.note.trim() : '',
    groups,
  };
}

export function parseSections(text) {
  const raw = readYaml(text, 'src/sections.yaml');
  const where = 'src/sections.yaml';
  const sections = {};
  for (const key of SECTION_KEYS) {
    const s = raw[key];
    if (!s || typeof s !== 'object') {
      throw new Error(`The "${key}" section is missing from ${where}. Each of academic, research, community and industry must be listed.`);
    }
    const categories = Array.isArray(s.categories) ? s.categories.map((c) => String(c).trim()).filter(Boolean) : [];
    if (categories.length === 0) {
      throw new Error(`The "${key}" section in ${where} needs at least one category, listed under "categories:" with each one starting with "- ".`);
    }
    sections[key] = {
      key,
      title: requireText(s, 'title', `The title of the "${key}" section`, where),
      description: requireText(s, 'description', `The description of the "${key}" section`, where),
      categories,
      overview: parseOverview(s.overview, key, where),
    };
  }
  return sections;
}

export const loadSettings = () => parseSettings(readFile(settingsPath, 'src/settings.yaml'));
export const loadSections = () => parseSections(readFile(sectionsPath, 'src/sections.yaml'));

export const configFiles = [settingsPath, sectionsPath];
