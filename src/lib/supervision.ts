// Reads the postgraduate supervision records from src/supervision.yaml for the
// Academic page, checks them, and builds the enquiry email.
import { load } from 'js-yaml';
import text from '../supervision.yaml?raw';
import { settings } from './items';
import { plain } from './placeholder.mjs';

export type Researcher = {
  name: string;
  programme: string;
  area: string;
  since: string;
  status: string;
  viva?: Date;
  outcome: string;
  highlight: string;
};

const WHERE = 'src/supervision.yaml';
const raw = (load(text) ?? {}) as Record<string, any>;
const str = (v: unknown) => (v === undefined || v === null ? '' : String(v).trim());

function researchers(list: unknown, group: string): Researcher[] {
  return (Array.isArray(list) ? list : []).map((r, i) => {
    const name = str(r?.name);
    if (!name) throw new Error(`Researcher ${i + 1} under "${group}" in ${WHERE} needs a "name".`);
    if (!str(r?.programme)) throw new Error(`${name} in ${WHERE} needs a "programme", for example PhD.`);
    let viva: Date | undefined;
    if (r?.viva) {
      viva = new Date(r.viva);
      if (Number.isNaN(viva.getTime())) {
        throw new Error(`The viva date for ${name} in ${WHERE} is not understood. Write it as year-month-day, for example 2026-10-06.`);
      }
    }
    return {
      name,
      programme: str(r.programme),
      area: str(r.area),
      since: str(r.since),
      status: str(r.status),
      viva,
      outcome: str(r.outcome),
      highlight: str(r.highlight),
    };
  });
}

const inv = raw.invitation ?? {};

export const supervision = {
  title: str(raw.title) || 'Postgraduate Research Supervision',
  introduction: str(raw.introduction),
  university: str(raw.university),
  main: researchers(raw.main, 'main'),
  co: researchers(raw.co, 'co'),
  invitation: {
    title: str(inv.title),
    text: (Array.isArray(inv.text) ? inv.text : [inv.text]).map(str).filter(Boolean),
    interests: (Array.isArray(inv.interests) ? inv.interests : []).map(str).filter(Boolean),
    button: str(inv.button) || 'Enquire About Research Supervision',
    subject: str(inv.subject),
    include: (Array.isArray(inv.include) ? inv.include : []).map(str).filter(Boolean),
    note: str(inv.note),
  },
};

/**
 * A mailto: link that opens a new email with the subject filled in and a
 * short template listing what to include. Line breaks are written as CRLF,
 * which every mail program understands.
 */
export function enquiryLink() {
  const { subject, include } = supervision.invitation;
  // Malay names have no surname, so the greeting uses the first name: Dear Dr Nurdiana
  const firstName = plain(settings.shortName).split(' ')[0];
  const fields = include.filter((line) => !/^cv\b/i.test(line)).map((line) => `${line}:`);
  const asksForCv = include.some((line) => /^cv\b/i.test(line));
  const body = [
    `Dear Dr ${firstName},`,
    '',
    'I am writing to enquire about postgraduate research supervision.',
    '',
    ...fields,
    '',
    ...(asksForCv ? ['I have attached my CV and a brief research proposal (if available).', ''] : []),
    'Kind regards,',
    '',
  ].join('\r\n');
  const query = [subject && `subject=${encodeURIComponent(subject)}`, `body=${encodeURIComponent(body)}`].filter(Boolean).join('&');
  return `mailto:${plain(settings.email)}?${query}`;
}
