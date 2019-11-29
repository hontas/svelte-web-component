export default function isBoolAttr(value) {
  return !value && typeof value === 'string';
}
