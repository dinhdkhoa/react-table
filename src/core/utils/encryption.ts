import crypto from 'crypto'

export const convertToSHA1 = (input: string): string => {
  return crypto.createHash('sha1').update(input).digest('hex')
}
