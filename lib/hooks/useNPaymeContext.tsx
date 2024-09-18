import { useContext } from "react";
import { NPaymeConnectContext } from "../components/WalletContextProvider";

export const useNPaymeContext = () => {
  const context = useContext(NPaymeConnectContext);

  if (context === undefined) {
    throw new Error(
      "useNPaymeContext must be used within a WalletContextProvider"
    );
  }

  return context;
};
