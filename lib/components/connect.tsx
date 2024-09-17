import React, { useEffect, useState, createContext } from 'react';
import { WagmiProvider } from 'wagmi';
import { watchChainId, CreateConfigParameters } from '@wagmi/core';
import { mainnet, sepolia, polygon, baseSepolia } from 'wagmi/chains';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import { AppKit } from '@web3modal/base';

import Connect from './components/Connect';

let modal: AppKit;

type WalletContextConfigProps = {
  brandColor?: string;
  copyColor?: string;
  projectId?: string;
  chains?: CreateConfigParameters['chains'];
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

export const ConnectContext = createContext({});

const queryClient = new QueryClient();

const ConnectContextProvider = (parameters: WalletContextProviderProps) => {
  const { children, config } = parameters;
  const {
    brandColor,
    copyColor,
    projectId = '64c300c731392456340fe626355b366e',
    chains = [mainnet, sepolia, polygon, baseSepolia] as const,
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
    onNetworkChanged,
    siwe,
    setSiwe,
  } = config;

  const [wagmiConfig, setWagmiConfig] = useState<any>(null);

  useEffect(() => {
    if (!modal) {
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
          '--w3m-color-mix-strength': 20,
        },
      });

      watchChainId(wagmiConfig, {
        onChange: (chainId, prevChainId) => {
          if (typeof onNetworkChanged === 'function') {
            onNetworkChanged(chainId, prevChainId);
          }
        },
      });

      setWagmiConfig(wagmiConfig);
    }
  }, []);

  useEffect(() => {
    if (w3m === true && modal) {
      modal.open();
      setW3m(null);
    }
  }, [w3m]);

  const changeAddress = (address: `0x${string}` | undefined) => {
    onAccountChanged({ address });
  };

  return (
    <ConnectContext.Provider
      value={{
        ...config,
      }}
    >
      {wagmiConfig && (
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <Connect
              siwe={siwe}
              setSiwe={setSiwe}
              changeAddress={changeAddress}
              brandColor={brandColor}
              copyColor={copyColor}
              isOpen={!!open}
              close={() => setOpen(false)}
            />
          </QueryClientProvider>
          {children}
        </WagmiProvider>
      )}
    </ConnectContext.Provider>
  );
};

export default ConnectContextProvider;
