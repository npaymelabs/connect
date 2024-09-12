import { useCallback, useMemo } from "react";
import { CoinbaseWalletSDK } from "@coinbase/wallet-sdk";
import { CoinbaseWalletLogo } from "./CoinbaseWalletLogo";
import { BrandedProgrammeButton } from "../components/Buttons";
import { Address } from "viem";

export function CreateWalletButton({
  handleSuccess,
  handleError,
}: {
  handleSuccess: (address: string) => void;
  handleError: (error: unknown) => void;
}) {
  const provider = useMemo(() => {
    const sdk = new CoinbaseWalletSDK({
      appName: "My Dapp",
      appLogoUrl: "https://example.com/logo.png",
      appChainIds: [84532],
    });

    const provider = sdk.makeWeb3Provider();

    return provider;
  }, []);

  const createWallet = useCallback(async () => {
    try {
      const [address] = await provider.request<[Address]>({
        method: "eth_requestAccounts",
      });
      handleSuccess(address);
    } catch (error) {
      handleError(error);
    }
  }, [handleSuccess, handleError]);

  return (
    <BrandedProgrammeButton onClick={createWallet}>
      <CoinbaseWalletLogo />
      Create Coinbase Smart Wallet
    </BrandedProgrammeButton>
  );
}
