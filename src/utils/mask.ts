import { maskedKeys } from 'src/constants/mask';

export function getMaskedObject(obj: unknown): unknown {
  if (obj && typeof obj === 'object') {
    const newObj = Array.isArray(obj) ? [] : {};

    for (const key in obj) {
      if (maskedKeys.includes(key)) {
        newObj[key] = '******';
      } else {
        newObj[key] = getMaskedObject(obj[key]);
      }
    }
    return newObj;
  }

  return obj;
}
