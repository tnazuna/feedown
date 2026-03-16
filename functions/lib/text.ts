const NAMED_HTML_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

export function decodeHtmlEntities(input: string | null | undefined): string {
  if (!input) return '';

  return input.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity) => {
    if (entity[0] === '#') {
      const isHex = entity[1]?.toLowerCase() === 'x';
      const rawValue = isHex ? entity.slice(2) : entity.slice(1);
      const codePoint = Number.parseInt(rawValue, isHex ? 16 : 10);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
    }

    return NAMED_HTML_ENTITIES[entity] ?? match;
  });
}

export function stripHtmlAndDecode(input: string | null | undefined): string {
  if (!input) return '';

  let output = input.replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1');

  // Some feeds double-encode entities. Decode before and after stripping tags.
  output = decodeHtmlEntities(decodeHtmlEntities(output));
  output = output.replace(/<[^>]+>/g, ' ');
  output = decodeHtmlEntities(output);

  return output.replace(/\s+/g, ' ').trim();
}
