/**
 * Convert string to binary (base64 encoded for storage)
 */
export function stringToBinary(text: string): string {
  // Convert string to Buffer, then to base64 (compact binary representation)
  return Buffer.from(text, 'utf8').toString('base64');
}

/**
 * Convert binary (base64) back to string
 */
export function binaryToString(binary: string): string {
  // Convert base64 back to Buffer, then to string
  return Buffer.from(binary, 'base64').toString('utf8');
}

/**
 * Convert string to hex binary
 */
export function stringToHex(text: string): string {
  return Buffer.from(text, 'utf8').toString('hex');
}

/**
 * Convert hex binary back to string
 */
export function hexToString(hex: string): string {
  return Buffer.from(hex, 'hex').toString('utf8');
}

/**
 * Convert string to actual binary string (0s and 1s)
 */
export function stringToBinaryString(text: string): string {
  return text
    .split('')
    .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join(' ');
}

/**
 * Convert binary string (0s and 1s) back to text
 */
export function binaryStringToString(binary: string): string {
  return binary
    .split(' ')
    .map(bin => String.fromCharCode(parseInt(bin, 2)))
    .join('');
}
