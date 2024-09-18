import { useCallback, useEffect, useState } from 'react';
import { useConnectContext } from '@npaymelabs/connect';

const CONNECT_WEB3_WALLET = 'Connect Web3 Wallet';
const OPEN_WEB3_WALLET = 'Open Web3 Wallet';

const Web3ConnectButton = ({ openModal, openWeb3Modal }: { openModal: () => void; openWeb3Modal: () => void }) => {
  const { address, signMessageAsync } = useConnectContext();
  const [text, setText] = useState(CONNECT_WEB3_WALLET);

  useEffect(() => {
    if (address) {
      setText(OPEN_WEB3_WALLET);
    }
  }, [address]);

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

  const handleMouseOver = useCallback(() => {
    setText(address ? `${address.substring(0, 4)}...${address.substring(address.length - 4)}` : CONNECT_WEB3_WALLET);
  }, [address]);

  const handleMouseLeave = useCallback(() => {
    setText(address ? OPEN_WEB3_WALLET : CONNECT_WEB3_WALLET);
  }, [address]);

  return (
    <>
      <button
        onClick={handleClick}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
        // disabled={isConnecting || isReconnecting ? true : undefined}
      >
        {text}
      </button>
      {address && <button onClick={handleSignIn}>Sign In With Ethereum</button>}
    </>
  );
};

export default Web3ConnectButton;
