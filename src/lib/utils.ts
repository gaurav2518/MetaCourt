export function generateCaseId(sequence: number, year = new Date().getFullYear()) {
  const paddedSequence = String(sequence).padStart(4, "0");
  return `MC-${year}-${paddedSequence}`;
}