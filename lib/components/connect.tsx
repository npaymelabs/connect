'use client'

import React, { useEffect, useCallback, createContext, useContext } from 'react';
import { WagmiProvider } from 'wagmi';
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
  // onAccountChanged: (any: any, prev?: number | string) => void;
  onNetworkChanged?: (any: number, prev?: number | string) => void;
  siwe?: any;
  setSiwe?: any;
};

type WalletContextProviderProps = {
  config: WalletContextConfigProps;
  children: React.ReactNode;
};

type ConnectContextType = {
  address: AddressType;
  signMessageAsync: (siwe: ConnectMessageType) => Promise<any>;
};

let modal: AppKit;
const queryClient = new QueryClient();

export const ConnectContext = createContext<ConnectContextType | null>(null);

export function ConnectContextProvider(props: {
  changeAddress?: (address: AddressType) => void;
  handleSuccess: () => void;
  siwe?: any;
  setSiwe?: any;
  children: React.ReactNode;
}) {
  const { children, siwe, setSiwe, handleSuccess } = props;

  const { signMessageAsync } = useSignMessage();

  const { address, isConnected, status } = useAccount();

  console.log('status: ', status);
  console.log('isConnected: ', isConnected);
  console.log('@npaymelabs/connect address...............', address);

  useEffect(() => {
    console.log('@npaymelabs/connect address changed...............', address);

    if (address && status === 'connected') {
      handleSuccess();
    }
  }, [address, status]);

  useEffect(() => {
    if (siwe && address) {
      handleSiwe(siwe);
      if (typeof setSiwe === 'function') {
        setSiwe(null);
      }
    }
  }, [siwe]);

  const handleSiwe = useCallback(async (siwe: ConnectMessageType) => {
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
  }, []);

  return (
    <ConnectContext.Provider
      value={{
        address,
        signMessageAsync: handleSiwe,
      }}
    >
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
    siwe,
    setSiwe,
  } = config;

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
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--npayme__brand-color', brandColor || '#000');
      document.documentElement.style.setProperty('--npayme__copy-color', copyColor || '#fff');
      document.documentElement.style.setProperty('--widget-card', '#fff');
      document.documentElement.style.setProperty('--widget-contrast', '#1A1A1A');
      document.documentElement.style.setProperty('--widget-contrast-low', '#464646');
      document.documentElement.style.setProperty('--widget-contrast-high', '#000');

      document.documentElement.style.setProperty('--bg', copyColor || '#f2f4f5');
    }

    if (!modal) {
      console.log('@npaymelabs/connect: create web3 modal....');
      modal = createWeb3Modal({
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

  const changeAddress = useCallback((address: AddressType) => {
    if (address) {
      handleSuccess();
    }

    // onAccountChanged({ address });
  }, []);

  const closeModal = useCallback(() => setOpen(false), []);
  const closeWeb3Modal = useCallback(() => modal?.close(), [modal]);
  const connectWeb3Wallet = useCallback(() => {
    if (modal) {
      closeModal();
      modal?.open();
    }
  }, [modal]);

  const handleSuccess = useCallback(() => {
    closeWeb3Modal();
    closeModal();
  }, [modal]);

  return (
    <>
      {/* @ts-ignore */}
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <ConnectContextProvider
            siwe={siwe}
            setSiwe={setSiwe}
            changeAddress={changeAddress}
            handleSuccess={handleSuccess}
          >
            {children}
          </ConnectContextProvider>

          <Modal isOpen={!!open} close={closeModal}>
            <ProgrammeHeader title="Join & Sign In" back={closeModal} />
            <Body>
              <SectionWrapper>
                <BaseLabel text-transform="none">I'd like to join and I need a Web3 Wallet</BaseLabel>
                <Spacer size={8} />
                <CreateWalletButton handleSuccess={handleSuccess} handleError={(e) => console.log(e)} />
              </SectionWrapper>
              <SectionWrapper>
                <BaseLabel>I already have a Web3 Wallet</BaseLabel>
                <Spacer size={8} />
                <BrandedProgrammeButton onClick={connectWeb3Wallet}>Connect Web3 Wallet</BrandedProgrammeButton>
              </SectionWrapper>
              <SectionWrapper>
                <Link text-transform="none" href={`https://ethereum.org/en/web3/`} target={'_blank'}>
                  What's a Web3 Wallet and why do I need one?
                </Link>
              </SectionWrapper>
            </Body>
          </Modal>
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
