'use client';

import React, { useEffect, useCallback, createContext, useContext } from 'react';
import { AppKit } from '@web3modal/base';

import { useAccount, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';

export type AddressType = `0x${string}` | undefined;

export type ConnectMessageType = {
  domain: string;
  address: string;
  statement: string;
  uri: string;
  version: string;
  chainId: number;
  nonce: string;
  targets: string[];
};

export type WalletContextConfigProps = {
  wagmiContext?: any;
  modal: AppKit;
  brandColor?: string;
  copyColor?: string;
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

type SuccessFunction = () => void;

export const ConnectContext = createContext<ConnectContextType | null>(null);

export default function WalletProvider(parameters: WalletContextProviderProps) {
  // export function ConnectContextProvider(props: {
  //   changeAddress?: (address: AddressType) => void;
  //   siwe?: any;
  //   setSiwe?: any;
  //   children: React.ReactNode;
  // }) {
  const { children, config } = parameters || { config: {} };
  const { modal, brandColor, copyColor, setOpen, w3m, setW3m, siwe, setSiwe } = config;

  const { signMessageAsync } = useSignMessage();
  const { address, isConnected, status } = useAccount();

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
  }, []);

  useEffect(() => {
    if (w3m === true && modal) {
      setW3m(null);
      modal.open();
    }
  }, [w3m]);

  useEffect(() => {
    if (address) {
      handleSuccess();
    }
  }, [address]);

  const closeModal = useCallback(() => setOpen(false), []);
  const closeWeb3Modal = useCallback(() => modal?.close(), [modal]);

  const handleSuccess: SuccessFunction = useCallback(() => {
    closeWeb3Modal();
    closeModal();
  }, [modal]);

  // const [signMessageAsync] = useState<any>(() => signMessageAsync);
  // const [{ address, isConnected, status }] = useState<any>(() => {
  //   const { address, isConnected, status } = useAccount();
  //   return { address, isConnected, status };
  // });

  console.log('status: ', status);
  // @ts-ignore
  console.log('isConnected: ', isConnected);
  console.log('@npaymelabs/connect address...............', address);

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
      // @ts-ignore
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

// export default function WalletProvider(parameters: WalletContextProviderProps) {
//   console.log('parameters.........', parameters);
//   const { children, config } = parameters || { config: {} };
//   const { modal, brandColor, copyColor, setOpen, w3m, setW3m, siwe, setSiwe } = config;

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       document.documentElement.style.setProperty('--npayme__brand-color', brandColor || '#000');
//       document.documentElement.style.setProperty('--npayme__copy-color', copyColor || '#fff');
//       document.documentElement.style.setProperty('--widget-card', '#fff');
//       document.documentElement.style.setProperty('--widget-contrast', '#1A1A1A');
//       document.documentElement.style.setProperty('--widget-contrast-low', '#464646');
//       document.documentElement.style.setProperty('--widget-contrast-high', '#000');

//       document.documentElement.style.setProperty('--bg', copyColor || '#f2f4f5');
//     }
//   }, []);

//   useEffect(() => {
//     if (w3m === true && modal) {
//       setW3m(null);
//       modal.open();
//     }
//   }, [w3m]);

//   const changeAddress = useCallback((address: AddressType) => {
//     if (address) {
//       handleSuccess();
//     }
//   }, []);

//   const closeModal = useCallback(() => setOpen(false), []);
//   const closeWeb3Modal = useCallback(() => modal?.close(), [modal]);

//   const handleSuccess: SuccessFunction = useCallback(() => {
//     closeWeb3Modal();
//     closeModal();
//   }, [modal]);

//   return (
//     // @ts-ignore
//     <ConnectContextProvider siwe={siwe} setSiwe={setSiwe} changeAddress={changeAddress} handleSuccess={handleSuccess}>
//       {children}
//     </ConnectContextProvider>
//   );
// }

export function useConnectContext() {
  const context = useContext(ConnectContext);
  if (!context) {
    throw new Error('useConnectContext must be use withinConnectContextProvider');
  }
  return context;
}
