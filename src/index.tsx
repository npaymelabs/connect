import { useEffect, useState } from 'react'

import Connect from './components/Connect'
import { WagmiProvider } from 'wagmi'
import { mainnet, sepolia, polygon, baseSepolia } from 'wagmi/chains'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { http, createConfig } from 'wagmi'
import { coinbaseWallet } from 'wagmi/connectors'

function ContextProvider(props) {
  const {
    onConnect,
    brandColor,
    copyColor,
    projectId = '64c300c731392456340fe626355b366e',
    chains = [mainnet, sepolia, polygon, baseSepolia],
    metadata = {
      name: 'example',
      description: 'npayme connect example',
      url: '',
      icons: []
    },
    open,
    setOpen
  } = props

  const [wagmiConfig, setWagmiConfig] = useState<any>(null)

  useEffect(() => {
    // const wagmiConfig = createConfig({
    //   chains: [baseSepolia],
    //   connectors: [
    //     coinbaseWallet({
    //       appName: 'Create Wagmi',
    //       preference: 'smartWalletOnly',
    //     }),
    //   ],
    //   transports: {
    //     [baseSepolia.id]: http(),
    //   },
    // });

    const wagmiConfig = defaultWagmiConfig({
      chains,
      projectId,
      metadata,
      auth: {
        email: true, // default to true
        socials: [
          'google',
          'x',
          'github',
          'discord',
          'apple',
          'facebook',
          'farcaster'
        ],
        showWallets: true, // default to true
        walletFeatures: true // default to true
      },
      ssr: true,
      enableInjected: true,
      // connectors: [
      //   coinbaseWallet({
      //     appName: metadata.name,
      //     preference: 'all' // 'smartWalletOnly'
      //   })
      // ],
      // transports: {
      //   [mainnet.id]: http(),
      //   [polygon.id]: http(),
      //   [sepolia.id]: http(),
      //   [baseSepolia.id]: http()
      // }
    })

    createWeb3Modal({
      wagmiConfig,
      projectId,
      themeMode: 'light',
      defaultChain: mainnet,
      // allWallets: 'ONLY_MOBILE',
      excludeWalletIds: [],
      enableSwaps: true, // Optional - true by default
      themeVariables: {
        '--w3m-color-mix': '#00DCFF',
        '--w3m-color-mix-strength': 20
      }
    })

    setWagmiConfig(wagmiConfig)
  }, [])

  return wagmiConfig ? (
    <WagmiProvider config={wagmiConfig}>
      <Connect
        onConnect={onConnect}
        brandColor={brandColor}
        copyColor={copyColor}
        open={open}
        setOpen={setOpen}
      />
      {props.children}
    </WagmiProvider>
  ) : null
}

export default ContextProvider
