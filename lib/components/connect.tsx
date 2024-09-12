import React, { useEffect, useRef, useState } from "react";
import { WagmiProvider } from "wagmi";
import {
  watchChainId,
  watchAccount,
  CreateConfigParameters,
  ResolvedRegister,
  Config,
  // reconnect,
} from "@wagmi/core";
import { mainnet, sepolia, polygon, baseSepolia } from "viem/chains";
// https://github.com/WalletConnect/web3modal/issues/1549#issuecomment-1845352911
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Connect from "./components/Connect";
import type { AppKit } from "@web3modal/base";

const queryClient = new QueryClient();

type WalletContextProviderProps = {
  brandColor?: string;
  copyColor?: string;
  projectId?: string;
  chains?: CreateConfigParameters["chains"];
  ssr?: boolean;
  metadata?: {
    name: string;
    description: string;
    url: string;
    icons: Array<string>;
  };
  open?: boolean | null;
  setOpen: (open: boolean) => void;
  w3m: boolean | null;
  setW3M: (we3: boolean | null) => void;
  onAccountChanged: (any: any, prev?: number | string) => void;
  onNetworkChanged?: (any: number, prev?: number | string) => void;
  siwe?: any;
  setSiwe?: (any: any) => void;
  children: React.ReactNode;
};

export default function WalletContextProvider(
  props: WalletContextProviderProps
) {
  const ref = useRef<AppKit>();

  const {
    brandColor,
    copyColor,
    projectId = "64c300c731392456340fe626355b366e",
    chains = [mainnet, sepolia, polygon, baseSepolia],
    metadata = {
      name: "example",
      description: "npayme connect example",
      url: "",
      icons: [],
    },
    open,
    setOpen,
    w3m,
    setW3M,
    onAccountChanged,
    onNetworkChanged,
    siwe,
    setSiwe,
    ssr,
  } = props;

  const [wallet, setWallet] = useState<`0x${string}` | undefined>();

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

  useEffect(() => {
    if (!ref.current) {
      ref.current = createWeb3Modal({
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
      console.log("modal", ref.current);
    }
  }, []);

  // reconnect(wagmiConfig);

  // const { wagmiConfig } = useMemo(() => {

  return (
    <WagmiProvider config={wagmiConfig as ResolvedRegister["config"]}>
      <QueryClientProvider client={queryClient}>
        <Connect
          // address={connectedWallet}
          siwe={siwe}
          setSiwe={setSiwe}
          address={wallet}
          brandColor={brandColor}
          copyColor={copyColor}
          isOpen={!!open}
          close={() => setOpen(false)}
        />
        <Observer
          onAccountChanged={onAccountChanged}
          setW3M={setW3M}
          w3m={w3m}
          onNetworkChanged={onNetworkChanged}
          wagmiConfig={wagmiConfig}
          setWallet={setWallet}
          modal={ref.current as AppKit | undefined}
        />
        {props.children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

const Observer = ({
  onAccountChanged,
  setW3M,
  w3m,
  onNetworkChanged,
  wagmiConfig,
  setWallet,
  modal,
}: {
  wagmiConfig: Config;
  w3m: boolean | null;
  setW3M: (we3: boolean | null) => void;
  onAccountChanged: (any: any, prev?: number | string) => void;
  onNetworkChanged?: (any: number, prev?: number | string) => void;
  modal: AppKit | undefined;
  setWallet: (address: `0x${string}` | undefined) => void;
}) => {
  useEffect(() => {
    console.log("Observer is running");

    watchChainId(wagmiConfig, {
      onChange: (chainId, prevChainId) => {
        if (typeof onNetworkChanged === "function") {
          onNetworkChanged(chainId, prevChainId);
        }
      },
    });

    watchAccount(wagmiConfig, {
      onChange: (data) => {
        setWallet(data.address);
        onAccountChanged(data);
        if (!data.address && modal) {
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
