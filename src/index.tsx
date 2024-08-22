import { useEffect, useState } from 'react'
import {
  // switchChain,
  watchAccount
  // watchPublicClient,
  // watchClient
} from '@wagmi/core'

import Connect from './components/Connect'
import { WagmiProvider } from 'wagmi'
import { mainnet, sepolia, polygon, baseSepolia } from 'wagmi/chains'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { createWeb3Modal } from '@web3modal/wagmi/react'
// import { http, createConfig } from 'wagmi'
// import { coinbaseWallet } from 'wagmi/connectors'

let modal: any

export default function ContextProvider(props) {
  const {
    address,
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
    setOpen,
    w3m,
    setW3M,
    onAccountChanged
  } = props

  const [wallet, setWallet] = useState<`0x${string}` | undefined>()
  // const [connectedWallet, setConnectedWallet] = useState<
  //   `0x${string}` | undefined
  // >(address)
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

    // const unwatchNetwork = watchNetwork(onNetworkChanged)
    const unwatchAccount = watchAccount(wagmiConfig, {
      onChange: (data) => {
        setWallet(address)
        // setConnectedWallet(data.address)
        onAccountChanged(data)
        if (!data.address) {
          modal.close()
        }
      }
    })
    // const unwatchPublicClient = watchPublicClient({}, onPublicClientChanged) // define chain id?
    // const unwatchWalletClient = watchWalletClient({}, onWalletClientChanged)

    // function onPublicClientChanged(data: GetPublicClientResult) {}
    // function onWalletClientChanged(data: GetWalletClientResult) {}

    setWagmiConfig(wagmiConfig)
  }, [])

  // useEffect(() => {
  //   if (w3m === true && modal && connectedWallet) {
  //     // localStorage.removeItem('@w3m-storage/SOCIAL_USERNAME')
  //     // localStorage.removeItem('@w3m/connected_social')
  //     // localStorage.removeItem('@w3m-storage/EMAIL')
  //     // localStorage.removeItem('@w3m-storage/EMAIL_LOGIN_USED_KEY')
  //     // localStorage.removeItem('@w3m-storage/LAST_USED_CHAIN_KEY')
  //     // localStorage.removeItem('@w3m-storage/SMART_ACCOUNT_ENABLED_NETWORKS')
  //     // localStorage.removeItem('wagmi.recentConnectorId')
  //     // localStorage.removeItem('@w3m/connected_connector')
  //     // localStorage.removeItem('wagmi.store')

  //     // disconnect()

  //     modal.open()
  //     setW3M(null)
  //   }
  // }, [w3m])

  return wagmiConfig ? (
    <WagmiProvider config={wagmiConfig}>
      <Connect
        // address={connectedWallet}
        address={wallet}
        onConnect={onConnect}
        brandColor={brandColor}
        copyColor={copyColor}
        isOpen={open}
        close={() => setOpen(false)}
      />
      {props.children}
    </WagmiProvider>
  ) : null
}
