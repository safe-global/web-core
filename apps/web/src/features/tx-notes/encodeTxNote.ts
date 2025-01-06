export function encodeTxNote(note: string, origin?: string): string {
  let originalOrigin = {}
  if (origin) {
    try {
      originalOrigin = JSON.parse(origin)
    } catch {
      // Ignore, invalid JSON
    }
  }
  return JSON.stringify(
    {
      ...originalOrigin,
      note,
    },
    null,
    0,
  )
}
