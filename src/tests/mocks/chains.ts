import type { ChainInfo } from '@safe-global/safe-gateway-typescript-sdk'
import { FEATURES, GAS_PRICE_TYPE, RPC_AUTHENTICATION } from '@safe-global/safe-gateway-typescript-sdk'

const CONFIG_SERVICE_CHAINS: ChainInfo[] = [
  {
    transactionService: 'https://safe-transaction.mainnet.gnosis.io',
    chainId: '1',
    chainName: 'Ethereum',
    chainLogoUri: '',
    shortName: 'eth',
    l2: false,
    isTestnet: false,
    description: 'The main Ethereum network',
    rpcUri: { authentication: RPC_AUTHENTICATION.API_KEY_PATH, value: 'https://mainnet.infura.io/v3/' },
    safeAppsRpcUri: { authentication: RPC_AUTHENTICATION.API_KEY_PATH, value: 'https://mainnet.infura.io/v3/' },
    publicRpcUri: { authentication: RPC_AUTHENTICATION.NO_AUTHENTICATION, value: 'https://cloudflare-eth.com' },
    blockExplorerUriTemplate: {
      address: 'https://etherscan.io/address/{{address}}',
      txHash: 'https://etherscan.io/tx/{{txHash}}',
      api: 'https://api.etherscan.io/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}',
    },
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      logoUri: 'https://safe-transaction-assets.gnosis-safe.io/chains/1/currency_logo.png',
    },
    theme: { textColor: '#001428', backgroundColor: '#E8E7E6' },
    ensRegistryAddress: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    gasPrice: [
      {
        type: GAS_PRICE_TYPE.ORACLE,
        uri: 'https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=JNFAU892RF9TJWBU3EV7DJCPIWZY8KEMY1',
        gasParameter: 'FastGasPrice',
        gweiFactor: '1000000000.000000000',
      },
      {
        type: GAS_PRICE_TYPE.ORACLE,
        uri: 'https://ethgasstation.info/json/ethgasAPI.json?api-key=8bb8066b5c3ed1442190d0e30ad9126c7b8235314397efa76e6977791cb2',
        gasParameter: 'fast',
        gweiFactor: '100000000.000000000',
      },
    ],
    disabledWallets: ['lattice'],
    features: [
      FEATURES.DOMAIN_LOOKUP,
      FEATURES.EIP1559,
      FEATURES.ERC721,
      FEATURES.SAFE_APPS,
      FEATURES.SAFE_TX_GAS_OPTIONAL,
      FEATURES.SPENDING_LIMIT,
      FEATURES.TX_SIMULATION,
    ],
    balancesProvider: {
      chainName: null,
      enabled: false,
    },
  },
  {
    transactionService: 'https://safe-transaction.xdai.gnosis.io',
    chainId: '100',
    chainName: 'Gnosis Chain',
    chainLogoUri: '',
    shortName: 'gno',
    l2: true,
    isTestnet: false,
    description: '',
    rpcUri: { authentication: RPC_AUTHENTICATION.NO_AUTHENTICATION, value: 'https://rpc.gnosischain.com/' },
    safeAppsRpcUri: { authentication: RPC_AUTHENTICATION.NO_AUTHENTICATION, value: 'https://rpc.gnosischain.com/' },
    publicRpcUri: { authentication: RPC_AUTHENTICATION.NO_AUTHENTICATION, value: 'https://rpc.gnosischain.com/' },
    blockExplorerUriTemplate: {
      address: 'https://blockscout.com/xdai/mainnet/address/{{address}}/transactions',
      txHash: 'https://blockscout.com/xdai/mainnet/tx/{{txHash}}/',
      api: 'https://blockscout.com/poa/xdai/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}',
    },
    nativeCurrency: {
      name: 'xDai',
      symbol: 'XDAI',
      decimals: 18,
      logoUri: 'https://safe-transaction-assets.gnosis-safe.io/chains/100/currency_logo.png',
    },
    theme: { textColor: '#ffffff', backgroundColor: '#48A9A6' },
    gasPrice: [{ type: GAS_PRICE_TYPE.FIXED, weiValue: '4000000000' }],
    disabledWallets: [
      'authereum',
      'fortmatic',
      'keystone',
      'lattice',
      'ledger',
      'opera',
      'operaTouch',
      'portis',
      'tally',
      'torus',
      'trezor',
      'trust',
      'walletLink',
    ],
    features: [
      FEATURES.EIP1559,
      FEATURES.ERC721,
      FEATURES.SAFE_APPS,
      FEATURES.SAFE_TX_GAS_OPTIONAL,
      FEATURES.SPENDING_LIMIT,
      FEATURES.TX_SIMULATION,
    ],
    balancesProvider: {
      chainName: null,
      enabled: false,
    },
  },
  {
    transactionService: 'https://safe-transaction.polygon.gnosis.io',
    chainId: '137',
    chainName: 'Polygon',
    chainLogoUri: '',
    shortName: 'matic',
    l2: true,
    isTestnet: false,
    description: 'L2 chain (MATIC)',
    rpcUri: { authentication: RPC_AUTHENTICATION.API_KEY_PATH, value: 'https://polygon-mainnet.infura.io/v3/' },
    safeAppsRpcUri: { authentication: RPC_AUTHENTICATION.API_KEY_PATH, value: 'https://polygon-mainnet.infura.io/v3/' },
    publicRpcUri: { authentication: RPC_AUTHENTICATION.NO_AUTHENTICATION, value: 'https://polygon-rpc.com' },
    blockExplorerUriTemplate: {
      address: 'https://polygonscan.com/address/{{address}}',
      txHash: 'https://polygonscan.com/tx/{{txHash}}',
      api: 'https://api.polygonscan.com/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}',
    },
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
      logoUri: 'https://safe-transaction-assets.gnosis-safe.io/chains/137/currency_logo.png',
    },
    theme: { textColor: '#ffffff', backgroundColor: '#8248E5' },
    gasPrice: [
      {
        type: GAS_PRICE_TYPE.ORACLE,
        uri: 'https://gasstation-mainnet.matic.network/',
        gasParameter: 'standard',
        gweiFactor: '1000000000.000000000',
      },
    ],
    disabledWallets: [
      'authereum',
      'fortmatic',
      'keystone',
      'lattice',
      'ledger',
      'opera',
      'operaTouch',
      'portis',
      'torus',
      'trezor',
      'trust',
      'walletLink',
    ],
    features: [
      FEATURES.EIP1559,
      FEATURES.ERC721,
      FEATURES.SAFE_APPS,
      FEATURES.SAFE_TX_GAS_OPTIONAL,
      FEATURES.SPENDING_LIMIT,
      FEATURES.TX_SIMULATION,
    ],
    balancesProvider: {
      chainName: null,
      enabled: false,
    },
  },
  {
    transactionService: 'https://safe-transaction.bsc.gnosis.io',
    chainId: '56',
    chainName: 'BNB Smart Chain',
    chainLogoUri: '',
    shortName: 'bnb',
    l2: true,
    isTestnet: false,
    description: '',
    rpcUri: { authentication: RPC_AUTHENTICATION.NO_AUTHENTICATION, value: 'https://bsc-dataseed.binance.org/' },
    safeAppsRpcUri: {
      authentication: RPC_AUTHENTICATION.NO_AUTHENTICATION,
      value: 'https://bsc-dataseed.binance.org/',
    },
    publicRpcUri: { authentication: RPC_AUTHENTICATION.NO_AUTHENTICATION, value: 'https://bsc-dataseed.binance.org/' },
    blockExplorerUriTemplate: {
      address: 'https://bscscan.com/address/{{address}}',
      txHash: 'https://bscscan.com/tx/{{txHash}}',
      api: 'https://api.bscscan.com/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}',
    },
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
      logoUri: 'https://safe-transaction-assets.gnosis-safe.io/chains/56/currency_logo.png',
    },
    theme: { textColor: '#001428', backgroundColor: '#F0B90B' },
    gasPrice: [],
    disabledWallets: [
      'authereum',
      'fortmatic',
      'keystone',
      'lattice',
      'ledger',
      'opera',
      'operaTouch',
      'portis',
      'tally',
      'torus',
      'trezor',
      'trust',
      'walletLink',
    ],
    features: [
      FEATURES.ERC721,
      FEATURES.SAFE_APPS,
      FEATURES.SAFE_TX_GAS_OPTIONAL,
      FEATURES.SPENDING_LIMIT,
      FEATURES.TX_SIMULATION,
    ],
    balancesProvider: {
      chainName: null,
      enabled: false,
    },
  },
  {
    transactionService: 'https://safe-transaction.ewc.gnosis.io',
    chainId: '246',
    chainName: 'Energy Web Chain',
    chainLogoUri: '',
    shortName: 'ewt',
    l2: true,
    isTestnet: false,
    description: '',
    rpcUri: { authentication: RPC_AUTHENTICATION.NO_AUTHENTICATION, value: 'https://rpc.energyweb.org' },
    safeAppsRpcUri: { authentication: RPC_AUTHENTICATION.NO_AUTHENTICATION, value: 'https://rpc.energyweb.org' },
    publicRpcUri: { authentication: RPC_AUTHENTICATION.NO_AUTHENTICATION, value: 'https://rpc.energyweb.org' },
    blockExplorerUriTemplate: {
      address: 'https://explorer.energyweb.org/address/{{address}}/transactions',
      txHash: 'https://explorer.energyweb.org/tx/{{txHash}}/internal-transactions',
      api: 'https://explorer.energyweb.org/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}',
    },
    nativeCurrency: {
      name: 'Energy Web Token',
      symbol: 'EWT',
      decimals: 18,
      logoUri: 'https://safe-transaction-assets.gnosis-safe.io/chains/246/currency_logo.png',
    },
    theme: { textColor: '#ffffff', backgroundColor: '#A566FF' },
    gasPrice: [{ type: GAS_PRICE_TYPE.FIXED, weiValue: '1000000' }],
    disabledWallets: [
      'authereum',
      'coinbase',
      'fortmatic',
      'keystone',
      'lattice',
      'ledger',
      'opera',
      'operaTouch',
      'portis',
      'tally',
      'torus',
      'trezor',
      'trust',
      'walletLink',
    ],
    features: [
      FEATURES.DOMAIN_LOOKUP,
      FEATURES.ERC721,
      FEATURES.SAFE_APPS,
      FEATURES.SAFE_TX_GAS_OPTIONAL,
      FEATURES.SPENDING_LIMIT,
    ],
    balancesProvider: {
      chainName: null,
      enabled: false,
    },
  },
  {
    transactionService: 'https://safe-transaction.arbitrum.gnosis.io',
    chainId: '42161',
    chainName: 'Arbitrum',
    chainLogoUri: '',
    shortName: 'arb1',
    l2: true,
    isTestnet: false,
    description: '',
    rpcUri: { authentication: RPC_AUTHENTICATION.NO_AUTHENTICATION, value: 'https://arb1.arbitrum.io/rpc' },
    safeAppsRpcUri: { authentication: RPC_AUTHENTICATION.NO_AUTHENTICATION, value: 'https://arb1.arbitrum.io/rpc' },
    publicRpcUri: { authentication: RPC_AUTHENTICATION.NO_AUTHENTICATION, value: 'https://arb1.arbitrum.io/rpc' },
    blockExplorerUriTemplate: {
      address: 'https://arbiscan.io/address/{{address}}',
      txHash: 'https://arbiscan.io/tx/{{txHash}}',
      api: 'https://api.arbiscan.io/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}',
    },
    nativeCurrency: {
      name: 'AETH',
      symbol: 'AETH',
      decimals: 18,
      logoUri: 'https://safe-transaction-assets.gnosis-safe.io/chains/42161/currency_logo.png',
    },
    theme: { textColor: '#ffffff', backgroundColor: '#28A0F0' },
    gasPrice: [],
    disabledWallets: [
      'authereum',
      'fortmatic',
      'keystone',
      'lattice',
      'ledger',
      'opera',
      'operaTouch',
      'portis',
      'tally',
      'torus',
      'trezor',
      'trust',
      'walletLink',
    ],
    features: [FEATURES.ERC721, FEATURES.SAFE_APPS, FEATURES.SAFE_TX_GAS_OPTIONAL, FEATURES.TX_SIMULATION],
    balancesProvider: {
      chainName: null,
      enabled: false,
    },
  },
  {
    transactionService: 'https://safe-transaction.aurora.gnosis.io',
    chainId: '1313161554',
    chainName: 'Aurora',
    chainLogoUri: '',
    shortName: 'aurora',
    l2: true,
    isTestnet: false,
    description: '',
    rpcUri: { authentication: RPC_AUTHENTICATION.NO_AUTHENTICATION, value: 'https://mainnet.aurora.dev' },
    safeAppsRpcUri: { authentication: RPC_AUTHENTICATION.NO_AUTHENTICATION, value: 'https://mainnet.aurora.dev' },
    publicRpcUri: { authentication: RPC_AUTHENTICATION.NO_AUTHENTICATION, value: 'https://mainnet.aurora.dev' },
    blockExplorerUriTemplate: {
      address: 'https://explorer.mainnet.aurora.dev/address/{{address}}/transactions',
      txHash: 'https://explorer.mainnet.aurora.dev/tx/{{txHash}}/',
      api: 'https://explorer.mainnet.aurora.dev/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}',
    },
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      logoUri: 'https://safe-transaction-assets.gnosis-safe.io/chains/1313161554/currency_logo.png',
    },
    theme: { textColor: '#ffffff', backgroundColor: '#78D64B' },
    gasPrice: [],
    disabledWallets: [
      'authereum',
      'coinbase',
      'fortmatic',
      'keystone',
      'lattice',
      'ledger',
      'opera',
      'operaTouch',
      'portis',
      'tally',
      'torus',
      'trezor',
      'trust',
      'walletLink',
    ],
    features: [FEATURES.CONTRACT_INTERACTION, FEATURES.ERC721, FEATURES.SAFE_APPS, FEATURES.SAFE_TX_GAS_OPTIONAL],
    balancesProvider: {
      chainName: null,
      enabled: false,
    },
  },
  {
    transactionService: 'https://safe-transaction.avalanche.gnosis.io',
    chainId: '43114',
    chainName: 'Avalanche',
    chainLogoUri: '',
    shortName: 'avax',
    l2: true,
    isTestnet: false,
    description: '',
    rpcUri: { authentication: RPC_AUTHENTICATION.NO_AUTHENTICATION, value: 'https://api.avax.network/ext/bc/C/rpc' },
    safeAppsRpcUri: {
      authentication: RPC_AUTHENTICATION.NO_AUTHENTICATION,
      value: 'https://api.avax.network/ext/bc/C/rpc',
    },
    publicRpcUri: {
      authentication: RPC_AUTHENTICATION.NO_AUTHENTICATION,
      value: 'https://api.avax.network/ext/bc/C/rpc',
    },
    blockExplorerUriTemplate: {
      address: 'https://snowtrace.io/address/{{address}}',
      txHash: 'https://snowtrace.io/tx/{{txHash}}',
      api: 'https://api.snowtrace.io/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}',
    },
    nativeCurrency: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18,
      logoUri: 'https://safe-transaction-assets.gnosis-safe.io/chains/43114/currency_logo.png',
    },
    theme: { textColor: '#ffffff', backgroundColor: '#000000' },
    gasPrice: [],
    disabledWallets: [
      'authereum',
      'fortmatic',
      'keystone',
      'lattice',
      'ledger',
      'opera',
      'operaTouch',
      'portis',
      'tally',
      'torus',
      'trezor',
      'trust',
    ],
    features: [
      FEATURES.EIP1559,
      FEATURES.ERC721,
      FEATURES.SAFE_APPS,
      FEATURES.SAFE_TX_GAS_OPTIONAL,
      FEATURES.SPENDING_LIMIT,
      FEATURES.TX_SIMULATION,
    ],
    balancesProvider: {
      chainName: null,
      enabled: false,
    },
  },
  {
    transactionService: 'https://safe-transaction.optimism.gnosis.io',
    chainId: '10',
    chainName: 'Optimism',
    chainLogoUri: '',
    shortName: 'oeth',
    l2: true,
    isTestnet: false,
    description: '',
    rpcUri: { authentication: RPC_AUTHENTICATION.NO_AUTHENTICATION, value: 'https://mainnet.optimism.io/' },
    safeAppsRpcUri: { authentication: RPC_AUTHENTICATION.NO_AUTHENTICATION, value: 'https://mainnet.optimism.io/' },
    publicRpcUri: { authentication: RPC_AUTHENTICATION.NO_AUTHENTICATION, value: 'https://mainnet.optimism.io/' },
    blockExplorerUriTemplate: {
      address: 'https://optimistic.etherscan.io/address/{{address}}',
      txHash: 'https://optimistic.etherscan.io/tx/{{txHash}}',
      api: 'https://api-optimistic.etherscan.io/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}',
    },
    nativeCurrency: {
      name: 'Ether',
      symbol: 'OETH',
      decimals: 18,
      logoUri: 'https://safe-transaction-assets.gnosis-safe.io/chains/10/currency_logo.png',
    },
    theme: { textColor: '#ffffff', backgroundColor: '#F01A37' },
    gasPrice: [],
    disabledWallets: [
      'authereum',
      'fortmatic',
      'keystone',
      'lattice',
      'ledger',
      'opera',
      'operaTouch',
      'portis',
      'tally',
      'torus',
      'trezor',
      'trust',
      'walletLink',
    ],
    features: [FEATURES.ERC721, FEATURES.SAFE_APPS, FEATURES.SAFE_TX_GAS_OPTIONAL, FEATURES.TX_SIMULATION],
    balancesProvider: {
      chainName: null,
      enabled: false,
    },
  },
  {
    transactionService: 'https://safe-transaction.goerli.gnosis.io/',
    chainId: '5',
    chainName: 'Goerli',
    chainLogoUri: '',
    shortName: 'gor',
    l2: true,
    isTestnet: true,
    description: 'Ethereum Testnet Görli',
    rpcUri: { authentication: RPC_AUTHENTICATION.API_KEY_PATH, value: 'https://goerli.infura.io/v3/' },
    safeAppsRpcUri: { authentication: RPC_AUTHENTICATION.API_KEY_PATH, value: 'https://goerli.infura.io/v3/' },
    publicRpcUri: {
      authentication: RPC_AUTHENTICATION.NO_AUTHENTICATION,
      value: 'https://goerli-light.eth.linkpool.io',
    },
    blockExplorerUriTemplate: {
      address: 'https://goerli.etherscan.io/address/{{address}}',
      txHash: 'https://goerli.etherscan.io/tx/{{txHash}}',
      api: 'https://api-goerli.etherscan.io/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}',
    },
    nativeCurrency: {
      name: 'Görli Ether',
      symbol: 'GOR',
      decimals: 18,
      logoUri: 'https://safe-transaction-assets.gnosis-safe.io/chains/5/currency_logo.png',
    },
    theme: { textColor: '#ffffff', backgroundColor: '#FBC02D' },
    gasPrice: [{ type: GAS_PRICE_TYPE.FIXED, weiValue: '24000000000' }],
    disabledWallets: [
      'authereum',
      'coinbase',
      'fortmatic',
      'keystone',
      'lattice',
      'portis',
      'tally',
      'torus',
      'trust',
      'walletLink',
    ],
    features: [
      FEATURES.DOMAIN_LOOKUP,
      FEATURES.EIP1559,
      FEATURES.ERC721,
      FEATURES.SAFE_APPS,
      FEATURES.SAFE_TX_GAS_OPTIONAL,
      FEATURES.SPENDING_LIMIT,
      FEATURES.TX_SIMULATION,
    ],
    balancesProvider: {
      chainName: null,
      enabled: false,
    },
  },
  {
    transactionService: 'https://safe-transaction.rinkeby.gnosis.io',
    chainId: '4',
    chainName: 'Rinkeby',
    chainLogoUri: '',
    shortName: 'rin',
    l2: false,
    isTestnet: true,
    description: 'Ethereum testnet',
    rpcUri: { authentication: RPC_AUTHENTICATION.API_KEY_PATH, value: 'https://rinkeby.infura.io/v3/' },
    safeAppsRpcUri: { authentication: RPC_AUTHENTICATION.API_KEY_PATH, value: 'https://rinkeby.infura.io/v3/' },
    publicRpcUri: {
      authentication: RPC_AUTHENTICATION.NO_AUTHENTICATION,
      value: 'https://rinkeby-light.eth.linkpool.io/',
    },
    blockExplorerUriTemplate: {
      address: 'https://rinkeby.etherscan.io/address/{{address}}',
      txHash: 'https://rinkeby.etherscan.io/tx/{{txHash}}',
      api: 'https://api-rinkeby.etherscan.io/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}',
    },
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      logoUri: 'https://safe-transaction-assets.gnosis-safe.io/chains/4/currency_logo.png',
    },
    theme: { textColor: '#ffffff', backgroundColor: '#E8673C' },
    ensRegistryAddress: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    gasPrice: [{ type: GAS_PRICE_TYPE.FIXED, weiValue: '24000000000' }],
    disabledWallets: ['fortmatic', 'lattice', 'tally'],
    features: [
      FEATURES.DOMAIN_LOOKUP,
      FEATURES.EIP1559,
      FEATURES.ERC721,
      FEATURES.SAFE_APPS,
      FEATURES.SAFE_TX_GAS_OPTIONAL,
      FEATURES.SPENDING_LIMIT,
      FEATURES.TX_SIMULATION,
    ],
    balancesProvider: {
      chainName: null,
      enabled: false,
    },
  },
  {
    transactionService: 'https://safe-transaction.volta.gnosis.io',
    chainId: '73799',
    chainName: 'Volta',
    chainLogoUri: '',
    shortName: 'vt',
    l2: true,
    isTestnet: false,
    description: '',
    rpcUri: { authentication: RPC_AUTHENTICATION.NO_AUTHENTICATION, value: 'https://volta-rpc.energyweb.org' },
    safeAppsRpcUri: { authentication: RPC_AUTHENTICATION.NO_AUTHENTICATION, value: 'https://volta-rpc.energyweb.org' },
    publicRpcUri: { authentication: RPC_AUTHENTICATION.NO_AUTHENTICATION, value: 'https://volta-rpc.energyweb.org' },
    blockExplorerUriTemplate: {
      address: 'https://volta-explorer.energyweb.org/address/{{address}}/transactions',
      txHash: 'https://volta-explorer.energyweb.org/tx/{{txHash}}/internal-transactions',
      api: 'https://volta-explorer.energyweb.org/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}',
    },
    nativeCurrency: {
      name: 'Volta Token',
      symbol: 'VT',
      decimals: 18,
      logoUri: 'https://safe-transaction-assets.gnosis-safe.io/chains/73799/currency_logo.png',
    },
    theme: { textColor: '#ffffff', backgroundColor: '#514989' },
    gasPrice: [{ type: GAS_PRICE_TYPE.FIXED, weiValue: '1000000' }],
    disabledWallets: [
      'authereum',
      'coinbase',
      'fortmatic',
      'keystone',
      'lattice',
      'ledger',
      'opera',
      'operaTouch',
      'portis',
      'tally',
      'torus',
      'trezor',
      'trust',
      'walletLink',
    ],
    features: [
      FEATURES.DOMAIN_LOOKUP,
      FEATURES.ERC721,
      FEATURES.SAFE_APPS,
      FEATURES.SAFE_TX_GAS_OPTIONAL,
      FEATURES.SPENDING_LIMIT,
    ],
    balancesProvider: {
      chainName: null,
      enabled: false,
    },
  },
]

export { CONFIG_SERVICE_CHAINS }
