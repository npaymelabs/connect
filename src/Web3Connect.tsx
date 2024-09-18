import { useConnectContext } from '@npaymelabs/connect';
// import { useAccount, useSignMessage } from 'wagmi';

const Web3ConnectButton = ({
  // address,
  openModal,
  openWeb3Modal,
}: {
  // address: string;
  openModal: () => void;
  openWeb3Modal: () => void;
}) => {
  const { address, signMessageAsync } = useConnectContext();

  const handleSignIn = () => {
    if (address) {
      signMessageAsync({
        domain: window.location.host,
        address: address,
        statement: 'Sign in to example.com',
        uri: window.location.origin,
        version: '1',
        chainId: 1,
        nonce: '1234556789',
        targets: [],
      });
    }
  };

  const handleClick = () => {
    if (address) {
      openWeb3Modal();
    } else {
      openModal();
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        // disabled={isConnecting || isReconnecting ? true : undefined}
      >
        {address ? `${address.substring(0, 4)}...${address.substring(address.length - 4)}` : 'Connect Web3 Wallet'}
      </button>
      {address && <button onClick={handleSignIn}>Sign In With Ethereum</button>}
    </>
  );
};

export default Web3ConnectButton;
