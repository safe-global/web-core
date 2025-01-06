import { faker } from '@faker-js/faker'
import { encodeTxNote } from './encodeTxNote'

describe('encodeTxNote', () => {
  it('should encode tx note with an existing origin', () => {
    const note = faker.lorem.sentence()
    const url = faker.internet.url()
    const origin = JSON.stringify({ url })
    const result = encodeTxNote(note, origin)
    expect(result).toEqual(JSON.stringify({ url, note }, null, 0))
  })

  it('should encode tx note with an empty origin', () => {
    const note = faker.lorem.sentence()
    const result = encodeTxNote(note)
    expect(result).toEqual(JSON.stringify({ note }, null, 0))
  })

  it('should encode tx note with an invalid origin', () => {
    const note = faker.lorem.sentence()
    const result = encodeTxNote(note, 'sdfgdsfg')
    expect(result).toEqual(JSON.stringify({ note }, null, 0))
  })
})
