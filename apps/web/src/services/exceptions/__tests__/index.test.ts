process.env.NEXT_PUBLIC_IS_PRODUCTION = 'true'
import { Errors, logError, trackError, CodedException } from '..'
import * as constants from '@/config/constants'
import * as Sentry from '@/services/sentry'

jest.mock('@/services/sentry', () => ({
  __esModule: true,
  ...jest.requireActual('@/services/sentry'),
}))

jest.spyOn(Sentry, 'sentryCaptureException').mockImplementation(() => '')

describe('CodedException', () => {
  beforeAll(() => {
    jest.mock('@/config/constants', () => ({
      __esModule: true,
      IS_PRODUCTION: false,
    }))
    console.error = jest.fn()
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('throws an error if code is not found', () => {
    expect(Errors.___0).toBe('0: No such error code')

    expect(() => {
      new CodedException('weird error' as any)
    }).toThrow('Code 0: No such error code (weird error)')
  })

  it('creates an error', () => {
    const err = new CodedException(Errors._100)
    expect(err.message).toBe('Code 100: Invalid input in the address field')
    expect(err.code).toBe(100)
    expect(err.content).toBe(Errors._100)
  })

  it('creates an error with an extra message from a string', () => {
    const err = new CodedException(Errors._100, '0x123')
    expect(err.message).toBe('Code 100: Invalid input in the address field (0x123)')
    expect(err.code).toBe(100)
    expect(err.content).toBe(Errors._100)
  })

  it('creates an error with an extra message from an Error instance', () => {
    const err = new CodedException(Errors._100, new Error('0x123'))
    expect(err.message).toBe('Code 100: Invalid input in the address field (0x123)')
    expect(err.code).toBe(100)
    expect(err.content).toBe(Errors._100)
  })

  it('creates an error with an extra message from an object', () => {
    const err = new CodedException(Errors._100, { address: '0x123' })
    expect(err.message).toBe('Code 100: Invalid input in the address field ({"address":"0x123"})')
    expect(err.code).toBe(100)
    expect(err.content).toBe(Errors._100)
  })

  it('creates an error with an extra message', () => {
    const err = new CodedException(Errors._901, 'getSafeBalance: Server responded with 429 Too Many Requests')
    expect(err.message).toBe(
      'Code 901: Error processing Safe Apps SDK request (getSafeBalance: Server responded with 429 Too Many Requests)',
    )
    expect(err.code).toBe(901)
  })

  describe('Logging', () => {
    it('logs to the console', () => {
      const err = logError(Errors._100, '123')
      expect(err.message).toBe('Code 100: Invalid input in the address field (123)')
      expect(console.error).toHaveBeenCalledWith(err)
    })

    it('logs to the console via the public log method', () => {
      const err = new CodedException(Errors._601)
      expect(err.message).toBe('Code 601: Error fetching balances')
      expect(console.error).not.toHaveBeenCalled()
      err.log()
      expect(console.error).toHaveBeenCalledWith(err)
    })

    // I can't figure out a way to override the IS_PRODUCTION constant
    it.skip('logs only the error message on prod', () => {
      jest.spyOn(constants, 'IS_PRODUCTION', 'get').mockImplementation(() => true)
      logError(Errors._100)
      expect(console.error).toHaveBeenCalledWith('Code 100: Invalid input in the address field')
    })
  })

  describe('Tracking', () => {
    // I can't figure out a way to override the IS_PRODUCTION constant
    it.skip('tracks using Sentry on production', () => {
      jest.spyOn(constants, 'IS_PRODUCTION', 'get').mockImplementation(() => true)
      const err = trackError(Errors._100)
      expect(Sentry.sentryCaptureException).toHaveBeenCalled()
      expect(console.error).toHaveBeenCalledWith(err.message)
    })

    it('does not track using Sentry in non-production envs', () => {
      const err = trackError(Errors._100)
      expect(Sentry.sentryCaptureException).not.toHaveBeenCalled()
      expect(console.error).toHaveBeenCalledWith(err)
    })
  })
})
