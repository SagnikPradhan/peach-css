/**
 * FNV hash
 *
 * @param string - String to be hashed
 */
export function hash(string: string) {
  const FNV_PRIME = 0x01000193;
  const FNV_OFFSET_BASIS = 0x811c9dc5;

  let hash = FNV_OFFSET_BASIS;

  for (const character of string) {
    hash ^= character.charCodeAt(0);
    hash *= FNV_PRIME;
  }

  return hash;
}
