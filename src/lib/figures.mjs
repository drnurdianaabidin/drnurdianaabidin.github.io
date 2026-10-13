// Markdown plugin: a picture on a line of its own, written with a caption in
// quotation marks,
//
//   ![Muscle fibres under the microscope](./fibres.jpg "Muscle fibres, stained. Photo: ...")
//
// becomes a figure with that caption printed underneath. Pictures without a
// caption stay as they are.

export function figurePlugin() {
  return {
    name: 'figures',
    element: {
      filter: ['p'],
      visit(node, ctx) {
        const children = (node.children ?? []).filter((c) => !(c.type === 'text' && !c.value.trim()));
        if (children.length !== 1) return;
        const img = children[0];
        if (img.type !== 'element' || img.tagName !== 'img') return;
        const caption = typeof img.properties?.title === 'string' ? img.properties.title.trim() : '';
        if (!caption) return;
        ctx.setProperty(img, 'title', null);
        ctx.replaceNode(node, [
          {
            type: 'element',
            tagName: 'figure',
            properties: { className: ['figure'] },
            children: [
              img,
              { type: 'element', tagName: 'figcaption', properties: {}, children: [{ type: 'text', value: caption }] },
            ],
          },
        ]);
      },
    },
  };
}
