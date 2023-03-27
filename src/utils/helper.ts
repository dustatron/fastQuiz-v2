import { decode } from 'html-entities';

export const cleanAsciiString = (string: string) => {
  if (string) {
    return decode(string)
  }
  return ""
};

export const shuffleList = (list: string[]) => {
  const newList = list.map((item) => ({ value: item, num: Math.random() }))
  const shuffleList = newList.sort((a, b) => (a.num - b.num))
  const listReturnedToStrings = shuffleList.map(item => item.value)
  return listReturnedToStrings
}

export const getCategoryOptions = (options: { [key: string]: string }) => {
  return Object.entries(options).map(([key, value]) => ({
    value: key,
    label: value,
  }));
};