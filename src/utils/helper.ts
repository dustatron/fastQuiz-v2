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

export const shuffleList = (list: string[]) => {
  const newList = list.map((item) => ({ value: item, num: Math.random() }))
  const shuffleList = newList.sort((a, b) => (a.num - b.num))
  const listReturnedToStrings = shuffleList.map(item => item.value)
  return listReturnedToStrings
}