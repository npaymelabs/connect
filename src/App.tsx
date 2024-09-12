import { useCallback, useState } from "react";
import Web3ConnectButton from "./Web3Connect";

// https://nodejs.org/api/packages.html#packages_self_referencing_a_package_using_its_name
import ContextProvider from "@npaymelabs/connect";
import { mainnet, sepolia, polygon, baseSepolia } from "viem/chains";
import SignIn from "./SignIn";

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
    >
      <Web3ConnectButton
        address={address}
        openModal={openModal}
        openWeb3Modal={openWeb3Modal}
      />
      {address && <SignIn/>}
      <h1> @npaymelabs/connect </h1>
    </ContextProvider>
  );
}

export default App;
