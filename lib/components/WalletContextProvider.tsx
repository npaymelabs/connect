import React, { useEffect, useMemo, useState, lazy, Suspense } from "react";
import { WagmiProvider } from "wagmi";
import {
  watchChainId,
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

// const Connect = lazy(() => import("./components/Connect"));

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
  children: React.ReactNode;
};

export default function WalletContextProvider(
  props: WalletContextProviderProps
) {
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
    ssr,
  } = props;

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This code will run only after the component has mounted on the client
    if (typeof window !== "undefined") {
      setIsClient(true); // Now window is available
    }
  }, []);

  const [, setWallet] = useState<`0x${string}` | undefined>();

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
    <WagmiProvider config={wagmiConfig as ResolvedRegister["config"]}>
      <QueryClientProvider client={queryClient}>
        {/* {modal && (
          <Suspense fallback={<></>}>
            <Connect
              // address={connectedWallet}
              brandColor={brandColor}
              copyColor={copyColor}
              isOpen={!!open}
              close={() => setOpen(false)}
            />
          </Suspense>
        )} */}
        <Observer
          onAccountChanged={onAccountChanged}
          setW3M={setW3M}
          w3m={w3m}
          onNetworkChanged={onNetworkChanged}
          wagmiConfig={wagmiConfig}
          setWallet={setWallet}
          modal={modal}
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
  modal: AppKit | null;
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
