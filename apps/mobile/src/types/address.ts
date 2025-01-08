export interface SafeInfo {
  address: Address
  chainId: string
}

export type Address = `0x${string}`
