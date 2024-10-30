import { useCallback, useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { createWeb3Modal } from '@web3modal/wagmi/react';

import AppProvider from './AppProvider';
import Web3ConnectButton from './Web3Connect';

// https://nodejs.org/api/packages.html#packages_self_referencing_a_package_using_its_name
import WalletProvider, { ConnectModal } from '@npaymelabs/connect';

import { mainnet, sepolia, polygon, baseSepolia } from 'viem/chains';

const chains = [mainnet, sepolia, polygon, baseSepolia] as const;

const metadata = {
  name: 'example',
  description: 'npayme connect example',
  url: '',
  icons: [],
};

const projectId = '64c300c731392456340fe626355b366e';

const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  auth: {
    email: true, // default to true
    socials: ['google', 'x', 'github', 'discord', 'apple', 'facebook', 'farcaster'],
    showWallets: true, // default to true
    walletFeatures: true, // default to true
  },
  ssr: false,
  enableInjected: true,
});

const modal = createWeb3Modal({
  wagmiConfig,
  projectId,
  themeMode: 'light',
  // defaultChain: mainnet,
  // allWallets: 'ONLY_MOBILE',
  excludeWalletIds: [],
  enableSwaps: true, // Optional - true by default
  themeVariables: {
    '--w3m-color-mix': '#00DCFF',
    '--w3m-color-mix-strength': 20,
  },
});

function App() {
  const [open, setOpen] = useState(false);
  const [w3m, setW3m] = useState<boolean | null>(null);
  const [siwe, setSiwe] = useState<any>(null);
  const requestSIWE = useCallback((args: any) => setSiwe(args), []);

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);
  const openWeb3Modal = useCallback(() => setW3m(true), []);

  const [inpage, setInpage] = useState(false);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false, // configure as per your needs
          },
        },
      })
  );

  return (
    // @ts-ignore
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <WalletProvider
          config={{
            modal,
            setOpen,
            w3m,
            setW3m,
            siwe,
            setSiwe,
          }}
        >
          <ConnectModal modal={modal} open={open} setOpen={setOpen} />
          <AppProvider
            inpage={inpage}
            openModal={openModal}
            closeModal={closeModal}
            openWeb3Modal={openWeb3Modal}
            requestSIWE={requestSIWE}
          >
            <Web3ConnectButton openModal={openModal} openWeb3Modal={openWeb3Modal} />
          </AppProvider>
        </WalletProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}

export default App;
