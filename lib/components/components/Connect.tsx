import { useEffect } from "react";

import Modal from "./Modal";
import ProgrammeHeader from "../header/Header";
import { BaseLabel, Link } from "./DataDisplay";
import { BrandedProgrammeButton } from "./Buttons";
import { CreateWalletButton } from "../smartwallet/CreateWalletButton";
import Spacer from "./Spacer";
import SectionWrapper from "./SectionWrapper";
import Body from "./Body";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useSignMessage } from "wagmi";
import { SiweMessage } from "siwe";
import { Address } from "viem";

function Connect(props: {
  address?: Address;
  brandColor?: string;
  copyColor?: string;
  isOpen: boolean;
  close: () => void;
  siwe: any;
  setSiwe: any;
}) {
  const { address, brandColor, copyColor, isOpen, close, siwe, setSiwe } =
    props;

  // const { address } = useAccount()
  const { open: openWeb3Modal, close: closeWeb3Modal } = useWeb3Modal();
  const { signMessageAsync } = useSignMessage();
  console.log("address............... 0", address);
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.style.setProperty(
        "--npayme__brand-color",
        brandColor || "#000"
      );
      document.documentElement.style.setProperty(
        "--npayme__copy-color",
        copyColor || "#fff"
      );
      document.documentElement.style.setProperty("--widget-card", "#fff");
      document.documentElement.style.setProperty(
        "--widget-contrast",
        "#1A1A1A"
      );
      document.documentElement.style.setProperty(
        "--widget-contrast-low",
        "#464646"
      );
      document.documentElement.style.setProperty(
        "--widget-contrast-high",
        "#000"
      );

      document.documentElement.style.setProperty(
        "--bg",
        copyColor || "#f2f4f5"
      );
    }

    return () => {
      closeWeb3Modal();
    };
  }, []);

  useEffect(() => {
    if (address) {
      handleSuccess();
    }
  }, [address]);

  useEffect(() => {
    if (siwe && address) {
      handleSiwe(siwe);
      if (typeof setSiwe === "function") {
        setSiwe(null);
      }
    }
  }, [siwe]);

  const handleSuccess = () => {
    // Cloase Web3Modal
    closeWeb3Modal();

    // Close this modal
    close();
  };

  const handleSiwe = async (siwe: {
    domain: string;
    address: string;
    statement: string;
    uri: string;
    version: string;
    chainId: number;
    nonce: string;
    targets: string[];
  }) => {
    try {
      const {
        domain,
        address,
        statement,
        uri,
        version,
        chainId,
        nonce,
        targets = [],
      } = siwe;

      const message = new SiweMessage({
        domain,
        address,
        statement,
        uri,
        version,
        chainId,
        nonce,
      });

      console.log("message.... 1", message);
      // const signature = "NA";
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      console.log("signature.... 1", signature);
      if (targets && targets.length > 0) {
        for (let i = 0; i < targets.length; i++) {
          const iFrm = document.getElementById(targets[i]);
          if (iFrm) {
            // @ts-ignore
            iFrm.contentWindow.postMessage(
              {
                type: "@npaymelabs/connect/siwe",
                payload: {
                  message,
                  signature,
                },
              },
              "*"
            );
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal isOpen={isOpen} close={close}>
      <ProgrammeHeader title="Join & Sign In" back={close} />
      <Body>
        <SectionWrapper>
          <BaseLabel text-transform="none">
            I'd like to join and I need a Web3 Wallet
          </BaseLabel>
          <Spacer size={8} />
          <CreateWalletButton
            handleSuccess={handleSuccess}
            handleError={(e) => console.log(e)}
          />
        </SectionWrapper>
        <SectionWrapper>
          <BaseLabel>I already have a Web3 Wallet</BaseLabel>
          <Spacer size={8} />
          <BrandedProgrammeButton onClick={() => openWeb3Modal()}>
            Connect Web3 Wallet
          </BrandedProgrammeButton>
        </SectionWrapper>
        <SectionWrapper>
          <Link
            text-transform="none"
            href={`https://ethereum.org/en/web3/`}
            target={"_blank"}
          >
            What's a Web3 Wallet and why do I need one?
          </Link>
        </SectionWrapper>
      </Body>
    </Modal>
  );
}

export default Connect;
