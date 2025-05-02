import v8 from 'node:v8'

export function getVariableMemorySize(obj: any): number {
  const objectList = [];
  const stack = [obj];
  let bytes = 0;

  while (stack.length) {
    const value = stack.pop();

    if (typeof value === 'boolean') {
      bytes += 4;
    } else if (typeof value === 'string') {
      bytes += value.length * 2;
    } else if (typeof value === 'number') {
      bytes += 8;
    } else if (typeof value === 'object' && value !== null && objectList.indexOf(value) === -1) {
      objectList.push(value);
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          stack.push(value[key]);
          bytes += 8; // Overhead for the existence of a reference
        }
      }
    }
  }

  return bytes;
}