import React, { useEffect, useState } from 'react'
import { WagmiProvider } from 'wagmi'
import { watchChainId, watchAccount } from '@wagmi/core'
import { mainnet, sepolia, polygon, baseSepolia, Chain } from 'wagmi/chains'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { QueryClientProvider } from '@tanstack/react-query'
// import { http, createConfig } from 'wagmi'
// import { coinbaseWallet } from 'wagmi/connectors'

import Connect from './components/Connect'
import { Web3Modal } from '@web3modal/wagmi'

// declare global {
//   var queryClient: any
// }

let modal: Web3Modal

type WalletContextProviderProps = {
  brandColor?: string | number
  copyColor?: string | number
  projectId?: string
  chains?: Array<Chain>
  metadata?: {
    name: string
    description: string
    url: string
    icons: Array<string>
  }
  open?: boolean | null
  setOpen: (open: boolean) => void
  w3m: boolean | null
  setW3M: (we3: boolean | null) => void
  onAccountChanged: (any: any, prev?: number | string) => void
  onNetworkChanged: (any: any, prev?: number | string) => void
  siwe?: any
  setSiwe?: (any: any) => void
  children: React.ReactNode
}

export default function WalletContextProvider(
  props: WalletContextProviderProps
) {
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
    onNetworkChanged,
    siwe,
    setSiwe
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
        // @ts-ignore
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

  console.log('globalThis.queryClient:', globalThis.queryClient)

  return wagmiConfig ? (
    <WagmiProvider config={wagmiConfig}>
      {globalThis.queryClient ? (
        <QueryClientProvider client={globalThis.queryClient}>
          <Connect
            // address={connectedWallet}
            siwe={siwe}
            setSiwe={setSiwe}
            address={wallet}
            brandColor={brandColor}
            copyColor={copyColor}
            isOpen={open}
            close={() => setOpen(false)}
          />
        </QueryClientProvider>
      ) : (
        <Connect
          // address={connectedWallet}
          siwe={siwe}
          setSiwe={setSiwe}
          address={wallet}
          brandColor={brandColor}
          copyColor={copyColor}
          isOpen={open}
          close={() => setOpen(false)}
        />
      )}
      {props.children}
    </WagmiProvider>
  ) : null
}
