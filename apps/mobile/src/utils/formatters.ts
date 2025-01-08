export const ellipsis = (str: string, length: number): string => {
  return str.length > length ? `${str.slice(0, length)}...` : str
}

export const makeSafeId = (chainId: string, address: string) => `${chainId}:${address}` as `${number}:0x${string}`

export const shortenAddress = (address: string, length = 4): string => {
  if (!address) {
    return ''
  }

  return `${address.slice(0, length + 2)}...${address.slice(-length)}`
}

export const formatValue = (value: string, decimals: number): string => {
  return (parseInt(value) / 10 ** decimals).toString().substring(0, 8)
}
