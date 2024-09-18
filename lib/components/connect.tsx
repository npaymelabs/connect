import React, { useEffect, useState, createContext, useContext } from 'react';
import { WagmiProvider } from 'wagmi';
// import { watchChainId } from '@wagmi/core';
import { CreateConfigParameters } from '@wagmi/core';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import Modal from './components/Modal';
import ProgrammeHeader from '../components/header/Header';
import { BaseLabel, Link } from './components/DataDisplay';
import { BrandedProgrammeButton } from './components/Buttons';
import { CreateWalletButton } from '../components/smartwallet/CreateWalletButton';
import Spacer from './components/Spacer';
import SectionWrapper from './components/SectionWrapper';
import Body from './components/Body';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';
import { AppKit } from '@web3modal/base';

type AddressType = `0x${string}` | undefined;

type ConnectMessageType = {
  domain: string;
  address: string;
  statement: string;
  uri: string;
  version: string;
  chainId: number;
  nonce: string;
  targets: string[];
};

type WalletContextConfigProps = {
  brandColor?: string;
  copyColor?: string;
  projectId?: string;
  chains: CreateConfigParameters['chains'];
  metadata?: {
    name: string;
    description: string;
    url: string;
    icons: Array<string>;
  };
  open?: boolean | null;
  setOpen: (open: boolean) => void;
  w3m: boolean | null;
  setW3m: (we3: boolean | null) => void;
  onAccountChanged: (any: any, prev?: number | string) => void;
  onNetworkChanged?: (any: number, prev?: number | string) => void;
  siwe?: any;
  setSiwe?: (any: any) => void;
};

type WalletContextProviderProps = {
  config: WalletContextConfigProps;
  children: React.ReactNode;
};

type ConnectContextType = {
  address: AddressType;
  signMessageAsync: (siwe: ConnectMessageType) => Promise<any>;
};

const queryClient = new QueryClient();

export const ConnectContext = createContext<ConnectContextType | null>(null);

export function ConnectContextProvider(props: {
  changeAddress: (address: AddressType) => void;
  brandColor?: string;
  copyColor?: string;
  isOpen: boolean;
  close: () => void;
  siwe: any;
  setSiwe: any;
  children: React.ReactNode;
}) {
  const { children, brandColor, copyColor, isOpen, close, siwe, setSiwe, changeAddress } = props;

  const [update, setAddress] = useState<AddressType>();
  const { signMessageAsync } = useSignMessage();

  const { address } = useAccount();
  const { open: openWeb3Modal, close: closeWeb3Modal } = useWeb3Modal();
  console.log('@npaymelabs/connect address...............', address);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--npayme__brand-color', brandColor || '#000');
      document.documentElement.style.setProperty('--npayme__copy-color', copyColor || '#fff');
      document.documentElement.style.setProperty('--widget-card', '#fff');
      document.documentElement.style.setProperty('--widget-contrast', '#1A1A1A');
      document.documentElement.style.setProperty('--widget-contrast-low', '#464646');
      document.documentElement.style.setProperty('--widget-contrast-high', '#000');

      document.documentElement.style.setProperty('--bg', copyColor || '#f2f4f5');
    }

    return () => {
      closeWeb3Modal();
    };
  }, []);

  useEffect(() => {
    console.log('@npaymelabs/connect address changed...............', address);

    changeAddress(address);

    if (address) {
      handleSuccess();
    }

    setAddress(address);
  }, [address]);

  useEffect(() => {
    if (siwe && address) {
      handleSiwe(siwe);
      if (typeof setSiwe === 'function') {
        setSiwe(null);
      }
    }
  }, [siwe]);

  const handleSuccess = () => {
    // Cloase Web3Modal
    closeWeb3Modal();

    // Close this modal
    close();
  };

  const handleSiwe = async (siwe: ConnectMessageType) => {
    try {
      const { domain, address, statement, uri, version, chainId, nonce, targets = [] } = siwe;

      const message = new SiweMessage({
        domain,
        address,
        statement,
        uri,
        version,
        chainId,
        nonce,
      });

      console.log('@npaymelabs/connect message....', message);
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      console.log('@npaymelabs/connect signature....', signature);
      if (targets && targets.length > 0) {
        for (let i = 0; i < targets.length; i++) {
          const iFrm = document.getElementById(targets[i]);
          if (iFrm) {
            // @ts-ignore
            iFrm.contentWindow.postMessage(
              {
                type: '@npaymelabs/connect/siwe',
                payload: {
                  message,
                  signature,
                },
              },
              '*'
            );
          }
        }
      }

      return signature;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ConnectContext.Provider
      value={{
        address: update,
        signMessageAsync: handleSiwe,
      }}
    >
      <Modal isOpen={isOpen} close={close}>
        <ProgrammeHeader title="Join & Sign In" back={close} />
        <Body>
          <SectionWrapper>
            <BaseLabel text-transform="none">I'd like to join and I need a Web3 Wallet</BaseLabel>
            <Spacer size={8} />
            <CreateWalletButton handleSuccess={handleSuccess} handleError={(e) => console.log(e)} />
          </SectionWrapper>
          <SectionWrapper>
            <BaseLabel>I already have a Web3 Wallet</BaseLabel>
            <Spacer size={8} />
            <BrandedProgrammeButton onClick={() => openWeb3Modal()}>Connect Web3 Wallet</BrandedProgrammeButton>
          </SectionWrapper>
          <SectionWrapper>
            <Link text-transform="none" href={`https://ethereum.org/en/web3/`} target={'_blank'}>
              What's a Web3 Wallet and why do I need one?
            </Link>
          </SectionWrapper>
        </Body>
      </Modal>
      {children}
    </ConnectContext.Provider>
  );
}

export default function WalletProvider(parameters: WalletContextProviderProps) {
  const { children, config } = parameters;
  const {
    brandColor,
    copyColor,
    projectId = '64c300c731392456340fe626355b366e',
    chains,
    metadata = {
      name: 'example',
      description: 'npayme connect example',
      url: '',
      icons: [],
    },
    open,
    setOpen,
    w3m,
    setW3m,
    onAccountChanged,
    // onNetworkChanged,
    siwe,
    setSiwe,
  } = config;

  const [modal, setModal] = useState<AppKit | null>(null);

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

  useEffect(() => {
    if (!modal) {
      setModal(
        createWeb3Modal({
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
        })
      );

      // watchChainId(wagmiConfig, {
      //   onChange: (chainId, prevChainId) => {
      //     if (typeof onNetworkChanged === 'function') {
      //       onNetworkChanged(chainId, prevChainId);
      //     }
      //   },
      // });
    }
  }, []);

  useEffect(() => {
    if (w3m === true && modal) {
      modal.open();
      setW3m(null);
    }
  }, [w3m]);

  const changeAddress = (address: AddressType) => {
    onAccountChanged({ address });
  };

  return (
    <>
      {/* @ts-ignore */}
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          {modal ? (
            <ConnectContextProvider
              siwe={siwe}
              setSiwe={setSiwe}
              changeAddress={changeAddress}
              brandColor={brandColor}
              copyColor={copyColor}
              isOpen={!!open}
              close={() => setOpen(false)}
              children={children}
            />
          ) : null}
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}

export function useConnectContext() {
  const context = useContext(ConnectContext);
  if (!context) {
    throw new Error('useConnectContext must be use withinConnectContextProvider');
  }
  return context;
}
