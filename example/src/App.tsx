import { useCallback, useState } from 'react'
// @ts-ignore
import ContextProvider from '@npaymelabs/connect'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Web3ConnectButton from './Web3Connect'

// 0. Setup queryClient
const queryClient = new QueryClient()

// const projectId = '64c300c731392456340fe626355b366e'
// const chains = [mainnet, baseSepolia] as const
const metadata = {
  name: 'example',
  description: 'npayme connect example',
  url: '',
  icons: []
}

// const wagmiConfig = defaultWagmiConfig({
//   chains,
//   projectId,
//   metadata,
//   ssr: true,
//   enableInjected: true
// })

// const wagmiConfig = createConfig({
//   chains,
//   ssr: true,
//   connectors: [
//     coinbaseWallet({
//       appName: 'Example'
//       // preference: 'smartWalletOnly',
//     })
//   ],
//   transports: {
//     [mainnet.id]: http(),
//     [baseSepolia.id]: http()
//   }
// })

function App() {
  const [open, setOpen] = useState(false)
  const [w3m, setW3m] = useState<boolean | null>(null)
  const [address, setAddress] = useState('')

  const [siwe, setSiwe] = useState<any>(null)

  console.log('address.....0', address)
  const onAccountChanged = useCallback((data: any) => {
    console.log(`onAccountChanged.......: address = '${address}' `, data)
    const { address: update = '' } = data
    if ((update && update != address) || !update) {
      console.log('Update address to......', update)
      setAddress(update)
      setOpen(false)
    }
  }, [])

  const openModal = useCallback(() => setOpen(true), [])
  const openWeb3Modal = useCallback(() => setW3m(true), [])

  const handleSignIn = () => {
    setSiwe({
      domain: window.location.host,
      address: address,
      statement: 'Sign in to example.com',
      uri: window.location.origin,
      version: '1',
      chainId: 1,
      nonce: '1234556789',
      targets: []
    })
  }
  console.log('address.....1', address)
  return (
    <QueryClientProvider client={queryClient}>
      <ContextProvider
        metadata={metadata}
        open={open}
        setOpen={setOpen}
        w3m={w3m}
        setW3M={setW3m}
        onAccountChanged={onAccountChanged}
        
          // @ts-ignore
        
        siwe={siwe}
        setSiwe={setSiwe}
      >
        <Web3ConnectButton
          address={address}
          openModal={openModal}
          openWeb3Modal={openWeb3Modal}
        />
        {address && (
          <button onClick={handleSignIn}>Sign In With Ethereum</button>
        )}
      </ContextProvider>
    </QueryClientProvider>
  )
}

export default App
