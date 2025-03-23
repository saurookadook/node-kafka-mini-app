export const camelToSnake = (str: string) => {
  return str.replace(/[A-Z]/g, (letter: string, offset: number) => {
    return offset === 0 ? letter.toLowerCase() : `_${letter.toLowerCase()}`;
  });
};

export const snakeToCamel = (str: string) => {
  return str.replace(/_[A-Za-z]/g, (match: string) => {
    return match[1].toUpperCase();
  });
};
