
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};


export const countOccurrences = (arr: Array<any>, val: any) =>
  arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
