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

  const connect = () => {
    console.log('connected')
  }

  return (
    <ContextProvider
      metadata={metadata}
      onConnect={connect}
      open={open}
      setOpen={setOpen}
    >
      <QueryClientProvider client={queryClient}>
        <Web3ConnectButton
          open={open}
          setOpen={setOpen}
        />
      </QueryClientProvider>
    </ContextProvider>
  )
}

export default App
