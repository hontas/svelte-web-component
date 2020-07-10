export default function getBool(value) {
  if (typeof value === 'string') return true;
  if (typeof value === 'boolean') return value;
  return value != null;
}
