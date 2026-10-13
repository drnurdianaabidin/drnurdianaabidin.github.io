// Placeholder text is written inside [[double square brackets]].
// On the site the brackets are removed and the text is wrapped in
// <mark class="ph">, which shows yellow while highlightPlaceholders
// is true in src/settings.yaml.

const PATTERN = /\[\[([\s\S]*?)\]\]/g;

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Text with the brackets removed, for page titles, alt text and link previews. */
export function plain(text = '') {
  return String(text).replace(PATTERN, '$1');
}

/** Safe HTML with placeholder parts wrapped in <mark class="ph">. */
export function ph(text = '') {
  return escapeHtml(String(text)).replace(PATTERN, '<mark class="ph">$1</mark>');
}

/**
 * Markdown plugin that does the same for the body text of each piece of
 * work. A placeholder may run across bold or italic text.
 */
export function placeholderPlugin() {
  let inside = false;

  const split = (value) => {
    const out = [];
    let rest = value;
    while (rest.length) {
      const marker = inside ? ']]' : '[[';
      const at = rest.indexOf(marker);
      const chunk = at === -1 ? rest : rest.slice(0, at);
      if (chunk) {
        const text = { type: 'text', value: chunk };
        out.push(
          inside ? { type: 'element', tagName: 'mark', properties: { className: ['ph'] }, children: [text] } : text
        );
      }
      if (at === -1) break;
      inside = !inside;
      rest = rest.slice(at + 2);
    }
    return out;
  };

  return {
    name: 'placeholders',
    text(node, ctx) {
      if (!inside && !node.value.includes('[[')) return;
      const parent = ctx.parent(node);
      if (parent && (parent.tagName === 'code' || parent.tagName === 'pre')) return;
      const parts = split(node.value);
      ctx.replaceNode(node, parts.length ? parts : [{ type: 'text', value: '' }]);
    },
  };
}
