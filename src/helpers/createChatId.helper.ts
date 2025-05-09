export const createChatId = (id1: string, id2: string): string => {
  const arr = [id1, id2];
  arr.sort();
  const id: string = arr.join("-");
  return id;
};
