import { useState } from 'react'
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
  const [addr1, setAddress] = useState()
  console.log('addr1.....0', addr1)
  const onAccountChanged = (data: any) => {
    console.log(`onAccountChanged.......: addr1 = '${addr1}' `, data)
    const { address: update } = data
    if ((update && update != addr1) || !update) {
      console.log('Update address to......', update)
      setAddress(update)
      setOpen(false)
    }
  }

  console.log('addr1.....1', addr1)
  return (
    <ContextProvider
      metadata={metadata}
      open={open}
      setOpen={setOpen}
      close={close}
      w3m={w3m}
      setW3M={setW3m}
      onAccountChanged={onAccountChanged}
    >
      <QueryClientProvider client={queryClient}>
        <Web3ConnectButton
          address={addr1}
          openModal={() => setOpen(true)}
          openWeb3Modal={() => setW3m(true)}
        />
      </QueryClientProvider>
    </ContextProvider>
  )
}

export default App
