import { useCallback, useState } from "react";
import Web3ConnectButton from "./Web3Connect";

// https://nodejs.org/api/packages.html#packages_self_referencing_a_package_using_its_name
import ContextProvider from "@npaymelabs/connect";
import { mainnet, sepolia, polygon, baseSepolia } from "viem/chains";

const metadata = {
  name: "example",
  description: "npayme connect example",
  url: "",
  icons: [],
};

function App() {
  const [open, setOpen] = useState(false);
  const [w3m, setW3m] = useState<boolean | null>(null);
  const [address, setAddress] = useState("");

  const [siwe, setSiwe] = useState<any>(null);

  console.log("address.....0", address);
  const onAccountChanged = useCallback((data: any) => {
    console.log(`onAccountChanged.......: address = '${address}' `, data);
    const { address: update = "" } = data;
    if ((update && update != address) || !update) {
      console.log("Update address to......", update);
      setAddress(update);
      setOpen(false);
    }
  }, []);

  const openModal = useCallback(() => setOpen(true), []);
  const openWeb3Modal = useCallback(() => setW3m(true), []);

  const handleSignIn = () => {
    setSiwe({
      domain: window.location.host,
      address: address,
      statement: "Sign in to example.com",
      uri: window.location.origin,
      version: "1",
      chainId: 1,
      nonce: "1234556789",
      targets: [],
    });
  };
  console.log("address.....1", address);

  const chains = [mainnet, sepolia, polygon, baseSepolia] as const;

  return (
    <ContextProvider
      chains={chains}
      metadata={metadata}
      open={open}
      setOpen={setOpen}
      w3m={w3m}
      setW3M={setW3m}
      onAccountChanged={onAccountChanged}
      siwe={siwe}
      setSiwe={setSiwe}
    >
      <Web3ConnectButton
        address={address}
        openModal={openModal}
        openWeb3Modal={openWeb3Modal}
      />
      {address && <button onClick={handleSignIn}>Sign In With Ethereum</button>}
      <h1> @npaymelabs/connect </h1>
    </ContextProvider>
  );
}

export default App;
