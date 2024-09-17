import { useCallback, useState } from 'react';
import Web3ConnectButton from './Web3Connect';

// https://nodejs.org/api/packages.html#packages_self_referencing_a_package_using_its_name
import ContextProvider from '@npaymelabs/connect';
import { mainnet, sepolia, polygon, baseSepolia } from 'viem/chains';

const chains = [mainnet, sepolia, polygon, baseSepolia] as const;

const metadata = {
  name: 'example',
  description: 'npayme connect example',
  url: '',
  icons: [],
};

function App() {
  const [open, setOpen] = useState(false);
  const [w3m, setW3m] = useState<boolean | null>(null);
  const [address, setAddress] = useState('');

  const [siwe, setSiwe] = useState<any>(null);

  const onAccountChanged = useCallback((data: any) => {
    const { address: update } = data;
    setAddress((prev) => {
      if ((prev && prev != update) || (prev && !update)) {
        setOpen(false);
      }
      return update;
    });
  }, []);

  const openModal = useCallback(() => setOpen(true), []);
  const openWeb3Modal = useCallback(() => setW3m(true), []);

  const handleSignIn = () => {
    setSiwe({
      domain: window.location.host,
      address: address,
      statement: 'Sign in to example.com',
      uri: window.location.origin,
      version: '1',
      chainId: 1,
      nonce: '1234556789',
      targets: [],
    });
  };

  

  return (
    <ContextProvider
      config={{
        chains,
        metadata,
        open,
        setOpen,
        w3m,
        setW3m,
        onAccountChanged,
        siwe,
        setSiwe,
      }}
    >
      <Web3ConnectButton address={address} openModal={openModal} openWeb3Modal={openWeb3Modal} />
      {address && <button onClick={handleSignIn}>Sign In With Ethereum</button>}
    </ContextProvider>
  );
}

export default App;
