import React, { createContext, useEffect, useMemo, useState } from "react";
import { WagmiProvider } from "wagmi";
import {
  watchAccount,
  CreateConfigParameters,
  ResolvedRegister,
  Config,
  // reconnect,
} from "@wagmi/core";
import { mainnet, sepolia, polygon, baseSepolia } from "wagmi/chains";
// https://github.com/WalletConnect/web3modal/issues/1549#issuecomment-1845352911
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppKit } from "@web3modal/base";

const queryClient = new QueryClient();

type WalletContextProviderProps = {
  projectId?: string;
  chains?: CreateConfigParameters["chains"];
  ssr?: boolean;
  metadata?: {
    name: string;
    description: string;
    url: string;
    icons: Array<string>;
  };
  children: React.ReactNode;
};

type NPaymeConnectContextType = {
  open: () => void;
  close: () => void;
  isOpen: boolean;
  setW3M: (we3: boolean | null) => void; 
  w3m: boolean | null;
};

export const NPaymeConnectContext = createContext<NPaymeConnectContextType>({
  open: () => {},
  close: () => {},
  isOpen: false,
  setW3M: (_: boolean | null) => {},
  w3m: null,
});

export default function WalletContextProvider(
  props: WalletContextProviderProps
) {
  const [open, setOpen] = useState(false);
  const [w3m, setW3M] = useState<boolean | null>(null);

  const {
    projectId = "64c300c731392456340fe626355b366e",
    chains = [mainnet, sepolia, polygon, baseSepolia],
    metadata = {
      name: "example",
      description: "npayme connect example",
      url: "",
      icons: [],
    },
    ssr,
  } = props;

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This code will run only after the component has mounted on the client
    if (typeof window !== "undefined") {
      setIsClient(true); // Now window is available
    }
  }, []);

  const wagmiConfig = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
    auth: {
      email: true, // default to true
      socials: [
        "google",
        "x",
        "github",
        "discord",
        "apple",
        "facebook",
        "farcaster",
      ],
      showWallets: true, // default to true
      walletFeatures: true, // default to true
    },
    ssr,
    enableInjected: true,
    // connectors: [
    //   coinbaseWallet({
    //     appName: metadata.name,
    //     preference: 'all' // 'smartWalletOnly'
    //   })
    // ],
    // transports: {
    //   [mainnet.id]: http(),
    //   [polygon.id]: http(),
    //   [sepolia.id]: http(),
    //   [baseSepolia.id]: http()
    // }
  });

  const modal = useMemo(() => {
    if (isClient) {
      return null;
    }

    return createWeb3Modal({
      wagmiConfig,
      projectId,
      themeMode: "light",
      defaultChain: mainnet,
      // allWallets: 'ONLY_MOBILE',
      excludeWalletIds: [],
      enableSwaps: true, // Optional - true by default
      themeVariables: {
        "--w3m-color-mix": "#00DCFF",
        "--w3m-color-mix-strength": 20,
      },
    });
  }, [isClient]);

  return (
    <NPaymeConnectContext.Provider
      value={{
        open: () => setOpen(true),
        close: () => setOpen(false),
        isOpen: open,
        setW3M,
        w3m,
      }}
    >
      <WagmiProvider config={wagmiConfig as ResolvedRegister["config"]}>
        <QueryClientProvider client={queryClient}>
          <Observer
            setW3M={setW3M}
            w3m={w3m}
            wagmiConfig={wagmiConfig}
            modal={modal}
          />
          {props.children}
        </QueryClientProvider>
      </WagmiProvider>
    </NPaymeConnectContext.Provider>
  );
}

const Observer = ({
  setW3M,
  w3m,
  wagmiConfig,
  modal,
}: {
  wagmiConfig: Config;
  w3m: boolean | null;
  setW3M: (we3: boolean | null) => void;
  modal: AppKit | null;
}) => {
  useEffect(() => {
    console.log("Observer is running");

    watchAccount(wagmiConfig, {
      onChange: (data) => {
        if (data.address && modal) {

          console.log("[WalletContextProvider - Observer] Wallet connected", data.address);
          setW3M(false);
          modal.close();
        }
      },
    });
  }, []);

  useEffect(() => {
    if (w3m === true && modal) {
      modal.open();
      setW3M(null);
    }
  }, [w3m]);

  return <></>;
};
