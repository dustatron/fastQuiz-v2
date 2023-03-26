export const cleanAsciiString = (string: string) => {
  if (string) {
    return string
      .replace(/&quot;/g, '"')
      .replace(/&ldquo;/g, '"')
      .replace(/&rdquo;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&rsquo;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&ouml;/g, "ö")
      .replace(/&eacute;/g, "ê")
      .replace(/&uuml;/g, "ü")
      .replace(/&sup2;/g, "²")
      .replace(/&Eacute;/g, "É");
  }
  return ""
};

export const shuffleList = (list: string[]) => {
  const newList = list.map((item) => ({ value: item, num: Math.random() }))
  const shuffleList = newList.sort((a, b) => (a.num - b.num))
  const listReturnedToStrings = shuffleList.map(item => item.value)
  return listReturnedToStrings
}