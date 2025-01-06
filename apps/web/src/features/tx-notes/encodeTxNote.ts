const MAX_ORIGIN_LENGTH = 200

const stringifyOrigin = (origin: Record<string, string>): string => JSON.stringify(origin, null, 0)

export function encodeTxNote(note: string, origin = ''): string {
  let originalOrigin = {}

  if (origin) {
    try {
      originalOrigin = JSON.parse(origin)
    } catch {
      // Ignore, invalid JSON
    }
  }

  let result = stringifyOrigin({
    ...originalOrigin,
    note,
  })

  if (result.length > MAX_ORIGIN_LENGTH) {
    result = stringifyOrigin({
      ...originalOrigin,
      note: note.slice(0, MAX_ORIGIN_LENGTH - origin.length),
    })
  }

  return result
}
