let counter = 0;

export const uid = (prefix = ''): string => {
  counter += 1;
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}${prefix ? '_' : ''}${Date.now().toString(36)}${rand}${counter}`;
};
