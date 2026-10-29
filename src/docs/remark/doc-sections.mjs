/**
 * Remark-Plugin für die Komponenten-Doku (content/components/*.mdx):
 *
 * - umschließt jeden ##-Abschnitt samt Inhalt mit <DocSection name="…">.
 *   Die Komponentenseiten rendern damit dieselbe Datei auf vier Unterseiten
 *   und zeigen je Unterseite nur ihre Abschnitte. Die Quelle bleibt eine
 *   Datei je Komponente.
 * - macht unter ## Rules aus einer Zeile, die nur aus `kennung` besteht und
 *   direkt auf eine ###-Überschrift folgt, ein <RuleId id="…">, das die
 *   Kennung mit Kopier-Button zeigt.
 *
 * Wer den Inhalt rendert, muss DocSection und RuleId als `components`
 * übergeben (Seiten und Markdown-Generator tun das).
 */

const text = (node) =>
  node.value ?? (node.children ?? []).map(text).join('');

const attr = (name, value) => ({ type: 'mdxJsxAttribute', name, value });

function ruleIds(children) {
  return children.map((node, i) => {
    const prev = children[i - 1];
    const isIdLine =
      node.type === 'paragraph' &&
      node.children.length === 1 &&
      node.children[0].type === 'inlineCode' &&
      prev?.type === 'heading' &&
      prev.depth === 3;
    if (!isIdLine) return node;
    return {
      type: 'mdxJsxFlowElement',
      name: 'RuleId',
      attributes: [attr('id', node.children[0].value)],
      children: [],
    };
  });
}

export function remarkDocSections() {
  return (tree, file) => {
    // Nur die Komponenten-Doku, keine anderen Markdown-Inhalte.
    const path = String(file.path ?? file.history?.[0] ?? '');
    if (!path.includes('/content/components/')) return;

    const out = [];
    let current = null;
    for (const node of tree.children) {
      if (node.type === 'heading' && node.depth === 2) {
        const name = text(node).trim().toLowerCase();
        current = { type: 'mdxJsxFlowElement', name: 'DocSection', attributes: [attr('name', name)], children: [node] };
        out.push(current);
      } else if (current && node.type !== 'mdxjsEsm') {
        current.children.push(node);
      } else {
        out.push(node);
      }
    }
    for (const section of out) {
      if (section.name === 'DocSection' && section.attributes[0].value === 'rules') {
        section.children = ruleIds(section.children);
      }
    }
    tree.children = out;
  };
}
