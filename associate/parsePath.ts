export function parsePath(path: string) {
  const parts = path.split('/');
  const associateid = parts[parts.length - 1];
  const weeknumber = Number(parts[parts.length - 3]);
  const batchid = parts[parts.length - 5];
  return { batchid, weeknumber, associateid };
}
