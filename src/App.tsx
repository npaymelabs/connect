import { useCallback } from "react";
import Web3ConnectButton from "./Web3Connect";
// https://nodejs.org/api/packages.html#packages_self_referencing_a_package_using_its_name
import { useNPaymeContext } from "@npaymelabs/connect";
import ConnectModal from "@npaymelabs/connect/connect-modal";
import SignIn from "./SignIn";
import { useAccount } from "wagmi";

function App() {
  const npayme = useNPaymeContext();
  const { address } = useAccount();

  // const onAccountChanged = useCallback((data: any) => {
  //   console.log(`onAccountChanged.......: address = '${address}' `, data);
  //   const { address: update = "" } = data;

  //   if ((update && update != address) || !update) {
  //     console.log("Update address to......", update);
  //     npayme.close();
  //   }
  // }, []);

  const openModal = useCallback(() => npayme.open(), []);
  const openWeb3Modal = useCallback(() => npayme.setW3M(true), []);

  return (
    <>
      <ConnectModal />
      <Web3ConnectButton
        address={address}
        openModal={openModal}
        openWeb3Modal={openWeb3Modal}
      />
      {address && <SignIn />}
      <h1> @npaymelabs/connect </h1>
    </>
  );
}

export default App;
