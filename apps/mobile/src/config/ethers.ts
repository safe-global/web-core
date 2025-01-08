//TODO: the interface of ethersjs register is not compatible
// with the interface of suggested crypto functions
// that is why we do casting.
// reference: https://docs.ethers.org/v6/cookbook/react-native/

import { BytesLike, ethers } from 'ethers'

import crypto from 'react-native-quick-crypto'

ethers.randomBytes.register((length) => {
  return new Uint8Array(crypto.randomBytes(length))
})

ethers.computeHmac.register((algo, key, data) => {
  return crypto.createHmac(algo, key).update(data).digest()
})

ethers.pbkdf2.register(
  (
    password: Uint8Array,
    salt: Uint8Array,
    iterations: number,
    keylen: number,
    algo: 'sha256' | 'sha512',
  ): BytesLike => {
    return crypto.pbkdf2Sync(password, salt, iterations, keylen, algo) as unknown as BytesLike
  },
)

ethers.sha256.register((data) => {
  return crypto
    .createHash('sha256')
    .update(data as unknown as string)
    .digest()
})

ethers.sha512.register((data) => {
  return crypto
    .createHash('sha512')
    .update(data as unknown as string)
    .digest()
})
