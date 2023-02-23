import {
  validateAddress,
  validateLimitedAmount,
  validateAmount,
  validatePrefixedAddress,
  validateDecimalLength,
} from '@/utils/validation'

describe('validation', () => {
  describe('Ethereum address validation', () => {
    it('should return undefined if the address is valid', () => {
      expect(validateAddress('0x1234567890123456789012345678901234567890')).toBeUndefined()
    })

    it('should return an error if the address is invalid', () => {
      expect(validateAddress('0x1234567890123456789012345678901234567890x')).toBe('Invalid address format')
      expect(validateAddress('0x8Ba1f109551bD432803012645Ac136ddd64DBA72')).toBe('Invalid address checksum')
    })
  })

  describe('Prefixed address validation', () => {
    const validate = validatePrefixedAddress('rin')

    it('should pass a bare address', () => {
      expect(validate('0x1234567890123456789012345678901234567890')).toBe(undefined)
    })

    it('should return an error if the address has the wrong prefix', () => {
      expect(validate('eth:0x1234567890123456789012345678901234567890')).toBe(`"eth" doesn't match the current chain`)
    })

    it('should pass validation is the address has the correct prefix', () => {
      expect(validate('rin:0x1234567890123456789012345678901234567890')).toBe(undefined)
    })
  })

  describe('Number validation', () => {
    it('returns an error if its not a number', () => {
      const result = validateAmount('abc')

      expect(result).toBe('The value must be a number')
    })

    it('returns an error if its a number smaller than or equal 0', () => {
      const result1 = validateAmount('0')
      expect(result1).toBe('The value must be greater than 0')

      const result2 = validateAmount('-1')
      expect(result2).toBe('The value must be greater than 0')
    })
  })

  describe('Limited amount validation', () => {
    it('returns an error if its not a number', () => {
      const result = validateLimitedAmount('abc', 18, '100')

      expect(result).toBe('The value must be a number')
    })

    it('returns an error if its a number smaller than or equal 0', () => {
      const result1 = validateLimitedAmount('0', 18, '100')
      expect(result1).toBe('The value must be greater than 0')

      const result2 = validateLimitedAmount('-1', 18, '100')
      expect(result2).toBe('The value must be greater than 0')
    })

    it('returns an error if its larger than the max', () => {
      const result = validateLimitedAmount('101', 18, '100000000000000000000')
      expect(result).toBe('Maximum value is 100')
    })
  })

  describe('Decimal length validation', () => {
    it('returns an error if there are insufficient decimals', () => {
      const result1 = validateDecimalLength('1.', 18)
      expect(result1).toBe('Should have 1 to 18 decimals')

      const result2 = validateDecimalLength('1.2', 18, 3)
      expect(result2).toBe('Should have 3 to 18 decimals')
    })

    it('returns an error if there are too many decimals', () => {
      const result = validateDecimalLength('1.123', 2)

      expect(result).toBe('Should have 1 to 2 decimals')
    })

    it('returns undefined if no maximum length is given', () => {
      const result = validateDecimalLength('1.123')

      expect(result).toBeUndefined()
    })

    it('returns undefined if the number is an integer', () => {
      const result = validateDecimalLength('1')

      expect(result).toBeUndefined()
    })

    it('returns undefined if the number has a valid length of decimals', () => {
      const result1 = validateDecimalLength('1.234', 18)
      expect(result1).toBeUndefined()

      const result2 = validateDecimalLength('1.234', 18, 3)
      expect(result2).toBeUndefined()
    })
  })
})
