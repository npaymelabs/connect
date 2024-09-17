import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
// https://nodejs.org/api/packages.html#packages_self_referencing_a_package_using_its_name
import WalletContextProvider from "@npaymelabs/connect";
import { mainnet, sepolia, polygon, baseSepolia } from "viem/chains";

const metadata = {
  name: "example",
  description: "npayme connect example",
  url: "",
  icons: [],
};

const chains = [mainnet, sepolia, polygon, baseSepolia] as const;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WalletContextProvider
      chains={chains}
      metadata={metadata}
    >
      <App />
    </WalletContextProvider>
  </StrictMode>
);
