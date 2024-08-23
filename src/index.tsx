import { useEffect, useState } from 'react'
import { WagmiProvider } from 'wagmi'
import { watchChainId, watchAccount } from '@wagmi/core'
import { mainnet, sepolia, polygon, baseSepolia } from 'wagmi/chains'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { createWeb3Modal } from '@web3modal/wagmi/react'
// import { http, createConfig } from 'wagmi'
// import { coinbaseWallet } from 'wagmi/connectors'

import Connect from './components/Connect'

let modal: any

export default function ContextProvider(props) {
  const {
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
    setOpen,
    w3m,
    setW3M,
    onAccountChanged,
    onNetworkChanged
  } = props

  const [wallet, setWallet] = useState<`0x${string}` | undefined>()
  const [wagmiConfig, setWagmiConfig] = useState<any>(null)

  useEffect(() => {
    if (!modal) {
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
        enableInjected: true
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

      modal = createWeb3Modal({
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

      watchChainId(wagmiConfig, {
        onChange: (chainId, prevChainId) => {
          if (typeof onNetworkChanged === 'function') {
            onNetworkChanged(chainId, prevChainId)
          }
        }
      })

      watchAccount(wagmiConfig, {
        onChange: (data) => {
          setWallet(data.address)
          onAccountChanged(data)
          if (!data.address) {
            modal.close()
          }
        }
      })

      setWagmiConfig(wagmiConfig)
    }
  }, [])

  useEffect(() => {
    if (w3m === true && modal) {
      modal.open()
      setW3M(null)
    }
  }, [w3m])

  return wagmiConfig ? (
    <WagmiProvider config={wagmiConfig}>
      <Connect
        // address={connectedWallet}
        address={wallet}
        brandColor={brandColor}
        copyColor={copyColor}
        isOpen={open}
        close={() => setOpen(false)}
      />
      {props.children}
    </WagmiProvider>
  ) : null
}
