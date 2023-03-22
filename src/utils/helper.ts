export const cleanAsciiString = (string: string) => {
  return string
    .replace(/&quot;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&ouml;/g, "ö")
    .replace(/&eacute;/g, "ê")
    .replace(/&uuml;/g, "ü");
};
