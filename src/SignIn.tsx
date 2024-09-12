import React, { useEffect } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { SiweMessage } from "siwe";

const SignIn: React.FC = () => {
  const { address, status, connector } = useAccount();
  const { signMessageAsync } = useSignMessage();

  useEffect(() => {
    console.log("address............... 1", address);
    console.log("status............... 1", status);
  }, [address, status]);

  const handleSignIn = async () => {
    console.log("connector............... 1", connector);

    const dataToSign = {
      domain: window.location.host,
      address: address,
      statement: "Sign in to example.com",
      uri: window.location.origin,
      version: "1",
      chainId: 1,
      nonce: "1234556789",
    };

    console.log("dataToSign", dataToSign);

    const message = new SiweMessage(dataToSign);

    const signed = await signMessageAsync({
      message: message.prepareMessage(),
    });

    alert(`Signed message: ${signed}`);
  };

  return <button onClick={handleSignIn}>Sign In With Ethereum</button>;
};

export default SignIn;
