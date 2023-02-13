/**
 *
 * @param str
 * @returns
 */
export const base64Encode = (str: string) => {
  return Buffer.from(str).toString('base64');
};

/**
 *
 * @param str
 * @param encoding
 * @returns
 */
export const base64Decode = (str: string, encoding?: BufferEncoding) => {
  return Buffer.from(str, 'base64').toString(encoding || 'utf8');
};
