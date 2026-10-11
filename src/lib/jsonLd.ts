/**
 * Serialises structured data for a <script type="application/ld+json"> element.
 * "<" is written as the JSON escape < so no value can close the script element early
 * ("</script>") or open a comment; the parsed JSON is unchanged.
 */
export function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
