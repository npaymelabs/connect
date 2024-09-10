import React, { useEffect, useMemo, useState } from 'react'
import { WagmiProvider } from 'wagmi'
import {
  watchChainId,
  watchAccount,
  CreateConfigParameters,
  Config,
  GetAccountReturnType,
  ResolvedRegister
} from '@wagmi/core'
import { mainnet, sepolia, polygon, baseSepolia } from 'wagmi/chains'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { createWeb3Modal } from '@web3modal/wagmi/react'

import Connect from './components/Connect'
import { Address } from 'viem'

const ContextProvider: React.FC<{
  children: React.ReactNode
  brandColor: string
  copyColor: string
  projectId?: string
  chains?: CreateConfigParameters['chains']
  metadata?: any
  open: boolean
  setOpen: (open: boolean) => void
  w3m: boolean | null
  setW3M: (w3m: boolean | null) => void
  onAccountChanged: (data: GetAccountReturnType<Config>) => void
  onNetworkChanged: (chainId: number, prevChainId: number) => void
}> = (props) => {
  const chains = props.chains ?? [mainnet, sepolia, polygon, baseSepolia]

  const {
    brandColor,
    copyColor,
    projectId = '64c300c731392456340fe626355b366e',

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

  const [wallet, setWallet] = useState<Address | undefined>()

  const { modal, wagmiConfig } = useMemo(() => {
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

    const _modal = createWeb3Modal({
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

    return {
      modal: _modal,
      wagmiConfig
    }
  }, [])

  useEffect(() => {
    if (w3m === true && modal) {
      modal.open()
      setW3M(null)
    }
  }, [w3m])

  return (
    <WagmiProvider config={wagmiConfig as ResolvedRegister['config']}>
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
  )
}

export default ContextProvider
